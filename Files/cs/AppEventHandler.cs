using System.Threading.Tasks;
using Terrasoft.Core;

namespace UsrDevTools
{
	/// <summary>
	/// Called from BPM AppEventListenerBase class by reflection (Add if not exists)
	/// </summary>
	public static class AppEventHandler
	{

		public static void OnCallFromConfiguration(string methodName, UserConnection userConnection)
		{
			switch (methodName)
			{
				case nameof(OnAppStart):
					OnAppStart(userConnection);
					break;
			}
		}

		public static void OnAppStart(UserConnection userConnection)
		{
			if (userConnection == null)
			{
				return;
			}
			Task.Run(() =>
			{
				EntitySchemaConfigs.Init(userConnection?.EntitySchemaManager);
			});
		}
	}

}
