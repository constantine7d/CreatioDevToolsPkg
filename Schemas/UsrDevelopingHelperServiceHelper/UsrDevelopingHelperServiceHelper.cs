namespace Terrasoft.Configuration.UsrDevTools
{
	using System;
	using Terrasoft.Core;

	#region Class: UsrDevelopingHelperServiceHelper

	/// <summary>
	/// Хелпер  <see cref="UsrDevelopingHelperServiceHelper">
	/// </summary>
	public class UsrDevelopingHelperServiceHelper
	{
		#region Properties

		private UserConnection UserConnection { get; }

		#endregion

		#region Constructors

		/// <summary>
		/// Инициализация <see cref="UsrDevelopingHelperServiceHelper"/>.
		/// </summary>
		/// <param name="userConnection">Активное подключение</param>
		public UsrDevelopingHelperServiceHelper(UserConnection userConnection)
		{
			UserConnection = userConnection ?? throw new ArgumentNullException(nameof(userConnection));
		}

		#endregion

		#region Methods: Public



		#endregion
	}

	#endregion

}