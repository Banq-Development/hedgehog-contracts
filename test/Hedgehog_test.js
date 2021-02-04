const _HedgehogFactory = artifacts.require("HedgehogFactory")
const _Hedgehog = artifacts.require("Hedgehog")
const test_WETH = artifacts.require("WETH")
const BN = web3.utils.BN

contract('Hedgehog_test', async accounts => {
	let HedgehogFactory
	let Hedgehog
	let WETH
	before(async() => {
		WETH = await test_WETH.new()
		HedgehogFactory = await _HedgehogFactory.deployed()
		await HedgehogFactory.createHedgehog(WETH.address)
		let Hedgehog_address = await HedgehogFactory.allHedgehogs.call(0)
		Hedgehog = await _Hedgehog.at(Hedgehog_address)
	})
	describe('Test_factory_deploy', function () {
		it("should deploy a Hedgehog instance and store variables", async () => {
			let hedgehog_length = await HedgehogFactory.allHedgehogsLength.call()
			assert.equal(hedgehog_length.toString(), "1", "Test_factory_deploy: allHedgehogs array to short")
			let initialized = await Hedgehog.initialized.call()
			assert.equal(initialized, true, "Test_factory_deploy: hedgehog uninitialized")
			let asset = await Hedgehog.asset.call()
			assert.equal(asset, WETH.address, "Test_factory_deploy: hedgehog false asset")
		})
		it("should store the asset ERC20 data", async () => {
			let hedgehog_name = await Hedgehog.name.call()
			let hedgehog_symbol = await Hedgehog.symbol.call()
			let hedgehog_decimals = await Hedgehog.decimals.call()
			let asset_name = await WETH.name.call()
			let asset_symbol = await WETH.symbol.call()
			let dec = 5
			assert.equal(hedgehog_name, "Hedgehog " + asset_name, "Test_factory_deploy: heddgehog false name")
			assert.equal(hedgehog_symbol, "h" + asset_symbol, "Test_factory_deploy: hedgehog false symbol")
			assert.equal(hedgehog_decimals.toString(), dec.toString(), "Test_factory_deploy: hedgehog false decimals")
		})
	})
	describe('Test_hedgehog_deposit', function () {
		it("should deposit", async () => {
			let base = new BN(10)
			let power = new BN(36)
			let max = base.pow(power)
			await WETH.deposit({value: max})
			await WETH.approve(Hedgehog.address, max)
			//Deposit with ~1000M assets
			let price = new BN(35000)
			power = new BN(10)
			let deposit = price.mul(base.pow(power))
			await Hedgehog.deposit(deposit, max)
			_tokens = await Hedgehog.balanceOf(accounts[0])
			_assets = await WETH.balanceOf(Hedgehog.address)
			let expected_asset = deposit.mul(deposit)
			assert.equal(_tokens.toString(), deposit.toString(), "Test_hedgehog_deposit: false deposit token amount")
			assert.equal(_assets.toString(), expected_asset, "Test_hedgehog_deposit: false deposit asset amount")
		})
	})
	describe('Test_hedgehog_price', function () {
		it("should return correct price", async () => {
			let price = await Hedgehog.price()
			let token_price = await Hedgehog.calculateAssetIn(10**5)
			assert.equal(price.toString(), token_price.toString(), "Test_hedgehog_price: false price")
		})
	})
	describe('Test_hedgehog_withdraw', function () {
		it("should withdraw", async () => {
			let base = new BN(10)
			let power = new BN(10)
			let price = new BN(35000)
			let withdraw = price.mul(base.pow(power))
			let _tokens = await Hedgehog.balanceOf(accounts[0])
			assert.equal(_tokens.toString(), withdraw.toString(), "Test_hedgehog_withdraw: false initial balance token amount")
			await Hedgehog.withdraw(withdraw, 0)
			_tokens = await Hedgehog.balanceOf(accounts[0])
			let _assets = await WETH.balanceOf(Hedgehog.address)
			assert.equal(_tokens.toString(), "0", "Test_hedgehog_withdraw: false withdraw token amount")
			assert.equal(_assets.toString(), "0", "Test_hedgehog_withdraw: false withdraw asset amount")
		})
	})
})
