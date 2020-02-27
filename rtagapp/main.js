//Initialize visibility
ShowLoginScreen();
HideMainScreen();

//Initialize functions
$("#connect_button").click(ConnectToTag);
$("#disconnect_button").click(DisconnectFromTag);
$("#emergency_button").click(TriggerEmergency);
$("#help_button").click(TriggerHelp);
$("#warning_button").click(TriggerWarning);
$("#whoami_button").click(WhoAmI);
$("#gw_button").click(SetAsGW);
$("#repeater_button").click(SetAsRepeater);
$("#tag_button").click(SetAsTag);


function HideLoginScreen()
{
		$("#login_screen").hide();
}

function ShowLoginScreen()
{
		$("#login_screen").show();
}

function HideMainScreen()
{
		$("#main_screen").hide();
}

function ShowMainScreen()
{
		$("#main_screen").show();
}

function ConnectToTag()
{
	HideLoginScreen();
	ShowMainScreen();
}

function DisconnectFromTag()
{
	ShowLoginScreen();
	HideMainScreen();
}

function TriggerEmergency()
{
}

function TriggerHelp()
{
}

function TriggerWarning()
{
}

function WhoAmI()
{
}

function SetAsGW()
{
}

function SetAsRepeater()
{
}

function SetAsTag()
{
}
