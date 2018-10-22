# HomeAssistant watchdog
This is Google Apps script which will monitor HomeAssistant instance status.
![featured](https://i.imgur.com/J8Pl5gC.png)

### Requirements
* HomeAssistant instance (version 0.80.x and up), reachable from outside
* Google Account

## Prepare HomeAssistant
### HomeAssistant API component
The check is performed using HomeAssistant API.  
If API is not yet enabled on your HA instance, enable it by adding `api:` to `configuration.yaml`.  
See more info on the [component page](https://www.home-assistant.io/components/api/)

### Acquire long-lived token
HomeAssistant http password is deprecard and tokens are now the right way for accessing the instance.  
We will aquire long-lived token and use it to query HA status using the API.  
To aquire the token, open your HA instace and click the profile thumbnail on the left side menu (or go `<ha_url>/profile`)  
Scroll down to __Long-Lived Access Tokens__ section and click on __CREATE TOKEN__ button.  
Give it a name (something like Watchdog), copy the token and keep it safe (it won't be shown again)  

![ha_token](https://i.imgur.com/TGDtgOw.png)

## Google Apps script project
### Setup code
Go to your [drive](https://drive.google.com) and click on new > more > Google Apps Script  
You can click on the 'Untitled Project' to give it a name (i.e. HomeAssistant watchdog)  
Use the 'new > script file' under 'file' menu to create new files and use the little arrow next to the files name to rename.

Copy the files content from the repository to the Google Script Project

![files_tree](https://i.imgur.com/tzYlH9R.png)

Go to the `Configuration.gs` file you've just created, and set the necessary variables.

Now the script is pretty much ready to run.  

#### Test it
Select the `Main.gs` file and make sure the selected function on the toolbar states 'main'.  
Now click the Play (arrow) button, a few dialogs will be shown, asking for the relevant permissions (execution and sending emails).  

![play_script](https://i.imgur.com/nptZaCY.png)

To verify the execution, go to View > Logs and make sure you see something like `HA is up`.

You can change the `HA_URL` on `Configuration.gs` to an invalid URL to make sure you get the notification emails properly.

### Schedule
Here is the magic, Google Apps Script enables schedule runs. This way, our code is executed by a stable Google cloud server.  
Click the clock icon (next to the Play button).  

![shcedule_icon](https://i.imgur.com/jDeFnBV.png)

On the dialog, click the 'Click here to add one now.' link
The default trigger is hour timer, but I personally prefer minute timer, use the last drop-list to set the time interval (I use 5 minutes)  

![schedule](https://i.imgur.com/q1lqMu7.png)

You can also click the 'Notification' link and ask Google Scripts to notify for any execution failure.

#### That's it!
