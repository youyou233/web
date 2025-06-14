// -------------------------------------------------------------------------------
// THIS FILE IS AUTO-GENERATED BY UI TOOL, SO PLEASE DON'T MODIFY IT BY YOURSELF!
// -------------------------------------------------------------------------------
export default class LoginUIView {
	content: cc.Node = null

	nodeMask: cc.Node = null
	nodeCheckbox: cc.Node = null
	nodeUserId: cc.Node = null
	nodePassword: cc.Node = null
	nodePerLogin: cc.Node = null
	nodeMask: cc.Node = null

	btnWeichengnian: cc.Button = null
	btnUserPact: cc.Button = null
	btnYinsiProtect: cc.Button = null
	btnLogin: cc.Button = null
	btnRegister: cc.Button = null


	initView(root : cc.Node) {
		this.content = cc.find("content", root)

		this.nodeMask = cc.find("content/nodeMask", root)
		this.nodeCheckbox = cc.find("content/nodeCheckbox", root)
		this.nodeUserId = cc.find("content/nodeUserId", root)
		this.nodePassword = cc.find("content/nodePassword", root)
		this.nodePerLogin = cc.find("content/nodePerLogin", root)
		this.nodeMask = cc.find("content/nodePerLogin/nodeMask", root)

		this.btnWeichengnian = cc.find("content/btnWeichengnian", root)?.getComponent(cc.Button)
		this.btnUserPact = cc.find("content/btnUserPact", root)?.getComponent(cc.Button)
		this.btnYinsiProtect = cc.find("content/btnYinsiProtect", root)?.getComponent(cc.Button)
		this.btnLogin = cc.find("content/btnLogin", root)?.getComponent(cc.Button)
		this.btnRegister = cc.find("content/btnRegister", root)?.getComponent(cc.Button)

	}

	onDestroy() {
		this.content = null

		this.nodeMask = null
		this.nodeCheckbox = null
		this.nodeUserId = null
		this.nodePassword = null
		this.nodePerLogin = null
		this.nodeMask = null

		this.btnWeichengnian = null
		this.btnUserPact = null
		this.btnYinsiProtect = null
		this.btnLogin = null
		this.btnRegister = null

	}


}