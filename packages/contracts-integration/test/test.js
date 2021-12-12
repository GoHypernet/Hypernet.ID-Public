const { expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Check Modifiers", function () {
    const criteria = "00000020000000030000000061b2833c"; // required id verification criteria
	const ownerid = 99;
	const addr1id = 1;
	let idregistry;
    let test;

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();

		// deploy an ERCD721 contract to serve as our Hypetnet.ID test registry
        const IDRegistry = await ethers.getContractFactory("IDRegistry");
        idregistry = await IDRegistry.deploy();
        await idregistry.deployTransaction.wait();

        // mint token to owner account with proper criteria
        let tx = await idregistry.safeMint(
            owner.address,
            ownerid,
            "00000020000000030000000061b2833c");
        await tx.wait();

		// mint token addr1 with insufficient criteria
        tx = await idregistry.safeMint(
            addr1.address,
            addr1id,
            "00000000000000020000000061b2833c");
        await tx.wait();

        // deploy a test contract to check modifiers
        const Test = await ethers.getContractFactory("Test");
        test = await Test.deploy("ID test.", criteria);
        await test.deployed();

        // set the contract address for the Hypernet.ID registry
        tx = await test.setRegistryAddress(idregistry.address);
        await tx.wait();
    });

    it("Check if an account has ever been verified.", async function () {
        const newName = "User Was Verified"
        // submit transaction from owner which has been verified
        let tx = await test.changeNameIfVerified(newName);
        await tx.wait();

        expect(await test.name()).to.equal(newName);

        // submit transaction without verification check for gas comparison
        tx = await test.changeName(newName);
        await tx.wait();
    });

    it("Block accounts that have never been verified.", async function () {
        const newName = "User Was Verified"
        // submit transaction from addr1 which has never been verified
        await expect(test.connect(addr2).changeNameIfVerified(newName)).to.be.revertedWith('ID: User has no verification token');
    });

    it("Check if an account has been verified with specified criteria.", async function () {
        const newName = "User Was Verified"

        // submit transaction from owner which has been verified with proper verification criteria
        let tx = await test.changeNameIfVerifiedWithCriteria(newName);
        await tx.wait();

		// ensure name was changed
        expect(await test.name()).to.equal(newName);

        // submit transaction without verification check for gas comparison
        tx = await test.changeName(newName);
        await tx.wait();
    });

	it("Block accounts that haven't met verification criteria.", async function () {
        const newName = "User Was Verified"

		// block transaction that don't meet the required criteria
		await expect(test.connect(addr1).changeNameIfVerifiedWithCriteria(newName)).to.be.revertedWith('ID: Invalid verification criteria');
		await expect(test.connect(addr1).changeNameIfVerifiedTokenWithCriteria(newName, addr1id)).to.be.revertedWith('ID: Invalid verification criteria');
    });

	it("Check if an account has been verified with specified criteria and save gas by giving tokenid as argument.", async function () {
        const newName = "User Was Verified"

        // submit transaction from owner which has been verified
        let tx = await test.changeNameIfVerifiedTokenWithCriteria(newName, ownerid);
        await tx.wait();

		expect(await test.name()).to.equal(newName);

        // submit transaction without verification check for gas comparison
        tx = await test.changeName(newName);
        await tx.wait();
    });

	it("Block accounts that try to claim tokenid that they do not own.", async function () {
        const newName = "User Was Verified"

		// block transaction where user tries to claim ownership of tokenid they don't own
		await expect(test.connect(addr1).changeNameIfVerifiedTokenWithCriteria(newName, ownerid)).to.be.revertedWith('ID: msgsender not owner of tokenID');
    });
});
