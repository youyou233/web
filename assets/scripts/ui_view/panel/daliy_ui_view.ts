// -------------------------------------------------------------------------------
// THIS FILE IS AUTO-GENERATED BY UI TOOL, SO PLEASE DON'T MODIFY IT BY YOURSELF!
// -------------------------------------------------------------------------------
export default class DaliyUIView {
	content: cc.Node = null

	nodeMask: cc.Node = null

	btnCertain: cc.Button = null


	initView(root : cc.Node) {
		this.content = cc.find("content", root)

		this.nodeMask = cc.find("content/nodeMask", root)

		this.btnCertain = cc.find("content/btnCertain", root)?.getComponent(cc.Button)

	}

	onDestroy() {
		this.content = null

		this.nodeMask = null

		this.btnCertain = null

	}


}