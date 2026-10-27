package com.improvtodo.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Paint;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.style.StrikethroughSpan;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class TodoWidgetProvider extends AppWidgetProvider {

    public static final String ACTION_COMPLETE_TASK = "com.improvtodo.app.ACTION_COMPLETE_TASK";
    public static final String ACTION_NATIVE_WIDGET_BRIDGE_CHANGED = "app.capgo.widgetkit.ACTION_NATIVE_WIDGET_BRIDGE_CHANGED";
    public static final String EXTRA_TASK_ID = "task_id";

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        String action = intent != null ? intent.getAction() : null;
        if (action == null) return;

        if (ACTION_COMPLETE_TASK.equals(action)) {
            String taskId = intent.getStringExtra(EXTRA_TASK_ID);
            if (taskId != null) {
                try {
                    // Update the boolean state for this task
                    SharedPreferences capPrefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
                    String updatesStr = capPrefs.getString("widget_task_updates", "{}");
                    JSONObject updates = new JSONObject(updatesStr);
                    
                    // Determine current state
                    boolean isCurrentlyCompleted = false;
                    SharedPreferences prefs = context.getSharedPreferences("capgo_widget_kit_templates_v1", Context.MODE_PRIVATE);
                    String sessionData = prefs.getString("native-session:todo-widget-session", null);
                    if (sessionData != null) {
                        JSONObject session = new JSONObject(sessionData);
                        JSONObject state = session.optJSONObject("state");
                        if (state != null) {
                            JSONArray tasks = state.optJSONArray("tasks");
                            if (tasks != null) {
                                for (int i = 0; i < tasks.length(); i++) {
                                    JSONObject t = tasks.getJSONObject(i);
                                    if (taskId.equals(t.optString("id"))) {
                                        isCurrentlyCompleted = t.optBoolean("completed", false);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    
                    // Apply any existing optimistic update override
                    if (updates.has(taskId)) {
                        isCurrentlyCompleted = updates.getBoolean(taskId);
                    }
                    
                    // Toggle the state
                    updates.put(taskId, !isCurrentlyCompleted);
                    
                    capPrefs.edit().putString("widget_task_updates", updates.toString()).apply();
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                // Force update all widget instances
                AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
                ComponentName thisWidget = new ComponentName(context, TodoWidgetProvider.class);
                int[] appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);
                if (appWidgetIds != null && appWidgetIds.length > 0) {
                    onUpdate(context, appWidgetManager, appWidgetIds);
                }
            }
        } else if (ACTION_NATIVE_WIDGET_BRIDGE_CHANGED.equals(action) || 
                   Intent.ACTION_BOOT_COMPLETED.equals(action) ||
                   AppWidgetManager.ACTION_APPWIDGET_UPDATE.equals(action)) {
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            ComponentName thisWidget = new ComponentName(context, TodoWidgetProvider.class);
            int[] appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);
            if (appWidgetIds != null && appWidgetIds.length > 0) {
                onUpdate(context, appWidgetManager, appWidgetIds);
            }
        }
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_todo);
        views.removeAllViews(R.id.widget_tasks_container);

        SharedPreferences prefs = context.getSharedPreferences("capgo_widget_kit_templates_v1", Context.MODE_PRIVATE);
        String sessionData = prefs.getString("native-session:todo-widget-session", null);
        
        SharedPreferences capPrefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        String updatesStr = capPrefs.getString("widget_task_updates", "{}");
        JSONObject updates = new JSONObject();
        try {
            updates = new JSONObject(updatesStr);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        if (sessionData != null) {
            try {
                JSONObject session = new JSONObject(sessionData);
                JSONObject state = session.optJSONObject("state");
                if (state != null) {
                    JSONArray tasks = state.optJSONArray("tasks");
                    if (tasks != null && tasks.length() > 0) {
                        
                        List<JSONObject> activeTasks = new ArrayList<>();
                        List<JSONObject> doneTasks = new ArrayList<>();
                        
                        for (int i = 0; i < tasks.length(); i++) {
                            JSONObject task = tasks.getJSONObject(i);
                            String id = task.optString("id");
                            
                            // Determine completion state (base state from app + optimistic update override)
                            boolean isCompleted = task.optBoolean("completed", false);
                            if (updates.has(id)) {
                                isCompleted = updates.getBoolean(id);
                            }
                            
                            if (isCompleted) {
                                doneTasks.add(task);
                            } else {
                                activeTasks.add(task);
                            }
                        }
                        
                        // Render Active Tasks (limit to 15 to avoid Binder transaction buffer overflow)
                        int maxActive = Math.min(activeTasks.size(), 15);
                        for (int i = 0; i < maxActive; i++) {
                            views.addView(R.id.widget_tasks_container, createTaskView(context, activeTasks.get(i), false));
                        }
                        
                        // Render Done Tasks (limit to 10)
                        if (!doneTasks.isEmpty()) {
                            RemoteViews headerView = new RemoteViews(context.getPackageName(), R.layout.widget_section_header);
                            views.addView(R.id.widget_tasks_container, headerView);
                            
                            int maxDone = Math.min(doneTasks.size(), 10);
                            for (int i = 0; i < maxDone; i++) {
                                views.addView(R.id.widget_tasks_container, createTaskView(context, doneTasks.get(i), true));
                            }
                        }
                        
                    } else {
                        RemoteViews emptyView = new RemoteViews(context.getPackageName(), R.layout.widget_task_item);
                        emptyView.setTextViewText(R.id.widget_task_text, "No active tasks! 🎉");
                        emptyView.setImageViewResource(R.id.widget_task_checkbox, android.R.drawable.ic_menu_today);
                        views.addView(R.id.widget_tasks_container, emptyView);
                    }
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        } else {
            RemoteViews emptyView = new RemoteViews(context.getPackageName(), R.layout.widget_task_item);
            emptyView.setTextViewText(R.id.widget_task_text, "Open app to sync tasks.");
            emptyView.setImageViewResource(R.id.widget_task_checkbox, android.R.drawable.ic_popup_sync);
            views.addView(R.id.widget_tasks_container, emptyView);
        }

        // Intent to launch the app when the widget header is clicked
        Intent intent = new Intent(context, MainActivity.class);
        intent.setPackage(context.getPackageName());
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_title, pendingIntent);
        
        // Intent to launch the input dialog when the add button is clicked
        Intent addIntent = new Intent(context, WidgetInputActivity.class);
        addIntent.setPackage(context.getPackageName());
        addIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent addPendingIntent = PendingIntent.getActivity(context, 1, addIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_add_btn, addPendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    private static RemoteViews createTaskView(Context context, JSONObject task, boolean isCompleted) {
        RemoteViews rv = new RemoteViews(context.getPackageName(), R.layout.widget_task_item);
        String title = task.optString("title", "Untitled");
        String id = task.optString("id");
        
        if (isCompleted) {
            SpannableString sp = new SpannableString(title);
            sp.setSpan(new StrikethroughSpan(), 0, title.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            rv.setTextViewText(R.id.widget_task_text, sp);
            rv.setImageViewResource(R.id.widget_task_checkbox, android.R.drawable.checkbox_on_background);
        } else {
            rv.setTextViewText(R.id.widget_task_text, title);
            rv.setImageViewResource(R.id.widget_task_checkbox, android.R.drawable.checkbox_off_background);
        }
        
        // Explicitly targeted intent to avoid Android 12+ background broadcast restrictions
        Intent completeIntent = new Intent(context, TodoWidgetProvider.class);
        completeIntent.setPackage(context.getPackageName());
        completeIntent.setAction(ACTION_COMPLETE_TASK);
        completeIntent.putExtra(EXTRA_TASK_ID, id);
        
        int requestCode = Math.abs(id.hashCode());
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
            context, 
            requestCode, 
            completeIntent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        
        rv.setOnClickPendingIntent(R.id.widget_task_checkbox, pendingIntent);
        rv.setOnClickPendingIntent(R.id.widget_task_row, pendingIntent);
        
        return rv;
    }
}
