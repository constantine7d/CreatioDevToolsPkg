define("UsrDevelopingHelpersImages", ["UsrDevelopingHelpersImagesResources", "terrasoft"], function (resources, Terrasoft) {
	return {
		FavIcon: Terrasoft.ImageUrlBuilder.getUrl(resources.localizableImages.FavIcon)
	};
});
