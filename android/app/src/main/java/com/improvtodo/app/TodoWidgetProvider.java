package com.improvtodo.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class TodoWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_todo);

        SharedPreferences prefs = context.getSharedPreferences("capgo_widget_kit_templates_v1", Context.MODE_PRIVATE);
        String sessionData = prefs.getString("native-session:todo-widget-session", null);

        StringBuilder tasksText = new StringBuilder();
        if (sessionData != null) {
            try {
                JSONObject session = new JSONObject(sessionData);
                JSONObject state = session.optJSONObject("state");
                if (state != null) {
                    JSONArray tasks = state.optJSONArray("tasks");
                    if (tasks != null && tasks.length() > 0) {
                        for (int i = 0; i < tasks.length(); i++) {
                            JSONObject task = tasks.getJSONObject(i);
                            tasksText.append("• ").append(task.optString("title", "Untitled")).append("\n");
                        }
                    } else {
                        tasksText.append("No active tasks! 🎉");
                    }
                }
            } catch (JSONException e) {
                tasksText.append("Error loading tasks.");
                e.printStackTrace();
            }
        } else {
            tasksText.append("Open app to sync tasks.");
        }

        views.setTextViewText(R.id.widget_tasks_text, tasksText.toString().trim());

        // Intent to launch the app when the widget is clicked
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
