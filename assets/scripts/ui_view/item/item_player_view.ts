// -------------------------------------------------------------------------------
// THIS FILE IS AUTO-GENERATED BY UI TOOL, SO PLEASE DON'T MODIFY IT BY YOURSELF!
// -------------------------------------------------------------------------------
export default class ItemPlayerView {
	nodeWeapon1: cc.Node = null
	nodeWeapon2: cc.Node = null


	initView(root : cc.Node) {
		this.nodeWeapon1 = cc.find("nodeWeapon1", root)
		this.nodeWeapon2 = cc.find("nodeWeapon2", root)

	}

	onDestroy() {
		this.nodeWeapon1 = null
		this.nodeWeapon2 = null

	}


}