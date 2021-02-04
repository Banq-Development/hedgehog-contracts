const _HedgehogFactory = artifacts.require("HedgehogFactory");
const _Hedgehog = artifacts.require("Hedgehog");
const test_WETH = artifacts.require("WETH");
const BN = web3.utils.BN;

contract('Hedgehog_gas_analysis', async accounts => {
	let HedgehogFactory;
	let Hedgehog;
	let WETH;
	let price_low = 500
	let price_high = 1500
	let gasPrice = 100000000000
	before(async() => {
		WETH = await test_WETH.new();
		HedgehogFactory = await _HedgehogFactory.deployed();
	});
	describe('analysis_factory_deploy', function () {
		it("gascost deploy Hedgehog instance", async () => {
			let receipt = await HedgehogFactory.createHedgehog(WETH.address);
			let gasUsed = receipt.receipt.gasUsed;
			console.log("GasUsed: "+gasUsed)
			console.log("GasPrice Gwei: "+gasPrice / 10**9)
			let gascost = gasPrice * gasUsed / 10**18
			console.log("Gascost ETH: "+gascost)
			console.log("Gascost total FIAT @ $"+price_low+": "+gascost * price_low)
			console.log("Gascost total FIAT @ $"+price_high+": "+gascost * price_high)	
		});
	});
	describe('analysis_hedgehog_deposit', function () {
		it("gascost Hedgehog deposit", async () => {
			let Hedgehog_address = await HedgehogFactory.allHedgehogs.call(0);
			Hedgehog = await _Hedgehog.at(Hedgehog_address)
			let base = new BN(10)
			let power = new BN(36)
			let max = base.pow(power)
			power = new BN(18)
			let deposit = base.pow(power)

			let convert = await WETH.deposit({value: max})
			let approve = await WETH.approve(Hedgehog.address, max)
			let receipt = await Hedgehog.deposit(deposit, max)
			let gasUsed_convert = convert.receipt.gasUsed;
			let gasUsed_approve = approve.receipt.gasUsed; 
			let gasUsed_receipt = receipt.receipt.gasUsed;
			let gasUsed_total = gasUsed_receipt + gasUsed_approve + gasUsed_convert
			console.log("GasPrice Gwei: "+gasPrice / 10**9)
			console.log("GasUsed convert: "+gasUsed_convert)
			console.log("GasUsed approve: "+gasUsed_approve)
			console.log("GasUsed deposit: "+gasUsed_receipt)
			console.log("GasUsed total: "+gasUsed_total)
			let gascost_convert = gasPrice * gasUsed_convert / 10**18
			console.log("Gascost convert ETH: "+gascost_convert)
			let gascost_approve = gasPrice * gasUsed_approve / 10**18
			console.log("Gascost approve ETH: "+gascost_approve)
			let gascost_receipt = gasPrice * gasUsed_receipt / 10**18
			console.log("Gascost deposit ETH: "+gascost_receipt)
			let gascost_total = gasPrice * gasUsed_total / 10**18
			console.log("Gascost total ETH: "+gascost_total)
			console.log("Gascost total FIAT @ $"+price_low+": "+gascost_total * price_low)
			console.log("Gascost total FIAT @ $"+price_high+": "+gascost_total * price_high)
		});
	});
	describe('analysis_hedgehog_withdraw', function () {
		it("gascost Hedgehog withdraw", async () => {
			let Hedgehog_address = await HedgehogFactory.allHedgehogs.call(0);
			Hedgehog = await _Hedgehog.at(Hedgehog_address)
			let base = new BN(10)
			let power = new BN(18)
			let withdraw = base.pow(power)

			let receipt = await Hedgehog.withdraw(withdraw, 0)
			let gasUsed = receipt.receipt.gasUsed;
			console.log("GasPrice Gwei: "+gasPrice / 10**9)
			console.log("GasUsed: "+gasUsed)
			let gascost = gasPrice * gasUsed / 10**18
			console.log("Gascost ETH: "+gascost)
			console.log("Gascost FIAT @ $"+price_low+": "+gascost * price_low)
			console.log("Gascost FIAT @ $"+price_high+": "+gascost * price_high)
			
		});	
	});	
})
