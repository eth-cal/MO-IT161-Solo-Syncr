# Syncr - Time Management in the Web (prototype)

## About
Syncr is a little web-app that provides 3 modes of time management and "task workspaces" called "planners" for users, ensuring that they can maximise organisation of tasks for whatever work needs to be done. The app can be used as a simple alarm or calendar app for casual users, or as a task-management powerhouse for small businesses.

>## Note
>This project demonstrates the features of Syncr. However, this is only a prototype. Expect that some features are incomplete, or actions don't do much. Certain points in this README file will have asterisks **(\*)** to denote features or parts of the prototype that have no substantial functionality.
>## Also
>Much of the tasks shown in this project are either purely randomised in every refresh or by certain interactions, or simply placed directly into the page. No management functionality is to be expected in this prototype.

## Project Contents
The below shows the prototype's file structure:
```
< root >
|-  pages
:   |   alarms.html
:   |   calendar.html
:   |   kanban.html
:   _   timeline.html
;
|-  scripts
:   |   al-interact.js
:   |   cl-interact.js
:   |   common.js
:   |   kb-interact.js
:   |   mode-selection.js
:   |   tl-interact.js
;
|-  styles
:   |   alarms.css
:   |   calendar.css
:   |   common.css
:   |   kanban.css
:   |   timeline.css
;
|   index.html
|   README.md
```

## Features
Syncr provides the following main features for managing time:
### 3 modes of task management:
Syncr provides 3 modes:
- **Calendar**
    - A traditional planning mode, allowing users to place\* tasks in boxes representing a specific day.
    - Sports filtering options that controls which type of tasks are visible, as well as which month of which year to view.
        - All 3 modes are visible in the calendar, providing a more, synchronised and comprehensive view of the allocated time slots for a day.
        - Extra tasks are collapsed when they do not fit the box. Expanding\* them will reveal those items.
    - A "Time Now" button when users want to switch back to the present month.
    
- **Alarms**
    - A planning mode that lets users specify a specific time in today, or each day of a week.
    - Includes snoozing\* options and per-day checkboxes\*.
    - Each alarm can be enabled\* or disabled\*.

- **Kanban**
    - A more advanced mode of time management.
    - Provides columns that can be used to contextually, or by status, place\* or move\* tasks into.
    - Tasks and columns can be renamed\*.
    - Each task can have a deadline set to it.
        - Timed tasks will be visible in the calendar view as well.

All modes provide a small clock that tells the time, with kanban, calendar, and timeline views including the date too.

### Planners\*
Planners provide users a way to contextually separate different tasks instead of crowding all tasks into one. Each planner will have its own list of tasks to keep, and they can be named. For example, one planner can contain only calendar tasks for birthdays of everyone a user knows, whereas another exists for their work, containing alarms and calendar tasks.

This feature complements users' task organisation when they have a lot of things to do in work, at home, or with other people. Instead of crowding 100 tasks and 20 alarms in one place, the users can split them into different planners, and focus on one at a time.

### Timeline view
The timeline is a complete summarisation of all the tasks and alarms the user created, allowing them to see which portion of time are they available. The timeline view can scroll left and right to seek between days, and up or down when more tasks need to be visually separated. It also has filtering\* and planner visibility\* features to scope down which tasks the user wants to see and not see.

This view can help improve the user's ability to allocate time and plan their work and reduce their need to, and burden in switching to different apps, since all the tasks that they want to see is on one screen.

If the user ever scrolled too far and can't find their way back, they can click on the "Time Now" button\* to return to the present day.

## Get Started
Syncr does not require logging in. To start a Planner:
1. Enter one of the planning modes: Calendar, Alarms, Kanban.
2. A planner sidebar should show up\* \*\*. Click "**+**" to add a new planner*.
3. You can adjust settings* of the planner, including the name*.

Entering the planning will now let you manage tasks.
- When adding a task in **calendar** or **kanban** mode:
    1. Enter **Calendar**/**Kanban** Mode.
    2. Click "**+**" to add a new task.
    3. Fill the information.
        3.1. Deadlines in kanban tasks are optional.
    4. Click "**Save**".
- When adding an **alarm**:
    1. Enter Alarm Mode.
    2. Fill the information below without selecting an existing alarm.
        2.1. ... or you can click the "Time Now" button to instantly add an alarm based on the current time*, then adjust settings there.
    3. Click "Add".

## Who Can Use?
The Syncr app can be used by anyone, regardless of their organisational status (i.e. personal or commercial).