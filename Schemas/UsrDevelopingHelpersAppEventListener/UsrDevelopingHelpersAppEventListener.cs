using System;
using Terrasoft.Core;
using Terrasoft.Web.Common;

namespace Terrasoft.Configuration.UsrDevelopingHelpers
{
	public class UsrDevelopingHelpersAppEventListener : AppEventListenerBase
	{
		private void CallDllAppEventHandler(string methodName, UserConnection userConnection)
		{
			var usrDevelopingHelpersAppEventHandler = Type.GetType("UsrDevelopingHelpers.AppEventHandler, UsrDevelopingHelpers");
			var onAppStartMethod = usrDevelopingHelpersAppEventHandler?.GetMethod("OnCallFromConfiguration");
			onAppStartMethod?.Invoke(null, new object[] { methodName, userConnection });
		}

		public override void OnAppStart(AppEventContext context)
		{
			base.OnAppStart(context);
			var appConnection = context.Application["AppConnection"] as AppConnection;
			var userConnection = appConnection?.SystemUserConnection;
			CallDllAppEventHandler(nameof(OnAppStart), userConnection);
		}

	}
}
