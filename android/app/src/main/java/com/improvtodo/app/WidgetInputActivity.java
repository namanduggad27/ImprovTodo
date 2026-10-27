package com.improvtodo.app;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;

public class WidgetInputActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Make the background transparent
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        if (getWindow() != null) {
            getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            // Show keyboard automatically
            getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_VISIBLE);
        }

        setContentView(R.layout.activity_widget_input);

        EditText editText = findViewById(R.id.widget_input_edit_text);
        editText.requestFocus();

        editText.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_DONE || 
                   (event != null && event.getAction() == KeyEvent.ACTION_DOWN && event.getKeyCode() == KeyEvent.KEYCODE_ENTER)) {
                    
                    String taskTitle = editText.getText().toString().trim();
                    if (!taskTitle.isEmpty()) {
                        saveNewTask(taskTitle);
                    }
                    finish(); // Close dialog
                    return true;
                }
                return false;
            }
        });
    }

    private void saveNewTask(String title) {
        SharedPreferences capPrefs = getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        String newTasksStr = capPrefs.getString("widget_new_tasks", "[]");
        try {
            JSONArray newTasks = new JSONArray(newTasksStr);
            newTasks.put(title);
            capPrefs.edit().putString("widget_new_tasks", newTasks.toString()).apply();
            
            // Force update widget so it can say "syncing" or similar if we wanted, 
            // but the React app will pick it up and update the widget soon.
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(this);
            ComponentName thisWidget = new ComponentName(this, TodoWidgetProvider.class);
            int[] appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);
            if (appWidgetIds != null && appWidgetIds.length > 0) {
                for (int id : appWidgetIds) {
                    TodoWidgetProvider.updateAppWidget(this, appWidgetManager, id);
                }
            }
            
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
