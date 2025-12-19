// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title DonationCampaign
 * @notice Kampanye donasi sederhana berbasis blockchain (ETH). Cocok untuk UAS.
 * - Donatur mengirim ETH melalui fungsi donate()
 * - Owner (deployer) bisa menarik dana via withdraw()
 * - Transparansi: totalRaisedWei (akumulasi donasi) & contractBalance() (saldo aktual kontrak)
 */
contract DonationCampaign {
    address public owner;

    string public title;
    string public description;

    uint256 public goalWei;        // target dalam wei
    uint256 public totalRaisedWei; // total donasi terkumpul (akumulasi, tidak berkurang saat withdraw)

    event Donated(
        address indexed donor,
        uint256 amountWei,
        string name,
        string message,
        uint256 timestamp
    );

    event Withdrawn(address indexed to, uint256 amountWei, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(string memory title_, string memory description_, uint256 goalWei_) {
        owner = msg.sender;
        title = title_;
        description = description_;
        goalWei = goalWei_;
    }

    /**
     * @notice Donasi ETH + catatan nama & pesan
     */
    function donate(string memory name, string memory message) external payable {
        require(msg.value > 0, "Donasi harus > 0");

        totalRaisedWei += msg.value;

        emit Donated(msg.sender, msg.value, name, message, block.timestamp);
    }

    /**
     * @notice Tarik dana dari kontrak (hanya owner).
     * @dev Menggunakan .call (lebih aman dibanding transfer/ send).
     */
    function withdraw(address payable to, uint256 amountWei) external onlyOwner {
        require(to != address(0), "Invalid address");
        require(amountWei > 0, "Invalid amount");
        require(amountWei <= address(this).balance, "Insufficient balance");

        (bool ok, ) = to.call{value: amountWei}("");
        require(ok, "Transfer failed");

        emit Withdrawn(to, amountWei, block.timestamp);
    }

    function isGoalReached() external view returns (bool) {
        return totalRaisedWei >= goalWei;
    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Terima ETH langsung (opsional)
    receive() external payable {
        totalRaisedWei += msg.value;
        emit Donated(msg.sender, msg.value, "Anon", "Direct transfer", block.timestamp);
    }
}
