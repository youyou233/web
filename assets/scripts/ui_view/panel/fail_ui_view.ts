// -------------------------------------------------------------------------------
// THIS FILE IS AUTO-GENERATED BY UI TOOL, SO PLEASE DON'T MODIFY IT BY YOURSELF!
// -------------------------------------------------------------------------------
export default class FailUIView {
	content: cc.Node = null

	nodeMask: cc.Node = null

	btnCertain: cc.Button = null

	labTitle: cc.Label = null
	labLevel: cc.Label = null


	initView(root : cc.Node) {
		this.content = cc.find("content", root)

		this.nodeMask = cc.find("content/nodeMask", root)

		this.btnCertain = cc.find("content/btnCertain", root)?.getComponent(cc.Button)

		this.labTitle = cc.find("content/labTitle", root)?.getComponent(cc.Label)
		this.labLevel = cc.find("content/labLevel", root)?.getComponent(cc.Label)

	}

	onDestroy() {
		this.content = null

		this.nodeMask = null

		this.btnCertain = null

		this.labTitle = null
		this.labLevel = null

	}


}