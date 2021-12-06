const { expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Check Modifiers", function () {
    let idregistry; 
    let test; 
    const criteria = "000020000000000200000000000000000"

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
    
        const IDRegistry = await ethers.getContractFactory("IDRegistry");
        idregistry = await IDRegistry.deploy();
        await idregistry.deployTransaction.wait();

        // mint token to verify owner account
        let tx = await idregistry.safeMint(
            owner.address,
            1232021,
            "00000000000000000000000061a7c071");
        await tx.wait();    

        // deploy contract to test modifiers
        const Test = await ethers.getContractFactory("Test");
        test = await Test.deploy("ID test.", criteria);
        await test.deployed();

        // set the override address for the ID registry for local testing
        tx = await test.setRegistryOverride(idregistry.address);
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
        await expect(test.connect(addr1).changeNameIfVerified(newName)).to.be.revertedWith('ID: User has no verification token');
    });

    it("Check if an account has been verified with specified criteria.", async function () {
        const newName = "User Was Verified"
        const crit = await test.CRITERIA();
        const asdf = await test._hasBeenVerifiedWithCriteria(owner.address, crit);
        const zxcv = await test.wtf(owner.address, crit);
        const qwer = await test._registrationURI(owner.address);
        console.log("criteria:", crit);
        console.log("rasdf", asdf);
        console.log('qwer', qwer)
        console.log('zxcv', zxcv.toString())

        // submit transaction from owner which has been verified 
        let tx = await test.changeNameIfVerifiedWithCriteria(newName);
        await tx.wait();

        expect(await test.name()).to.equal(newName);

        // submit transaction without verification check for gas comparison
        tx = await test.changeName(newName);
        await tx.wait();
    });
});