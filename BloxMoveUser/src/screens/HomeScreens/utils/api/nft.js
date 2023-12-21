import {ethers} from 'ethers';
import {getProvider, getSigner} from '@app/src/lib/WalletFacade';
import deviceStorage from '../../../utils/AuthDeviceStorage';
import {setNFTBalance} from '../../redux/actions';
import {displayEtherErrors} from '@app/src/helpers/displayErrors';
let NIGERIA_SERVICE_SC_ADDRESS = '';
let NFTICKET_MASTER_SC_ADDRESS = '';
let MTP_WALLET_ADDRESS = '';
let ENGN_SC_ADDRESS = '';
let PROCESSOR_CONTRACT_ADDRESS = '';

// Get NFT
export async function getNFTBalance(ticketId) {
  try {
    const address = JSON.parse(await deviceStorage.getNFTAddress());
    const abis = JSON.parse(await deviceStorage.getNFTAbi());
    let abi = [];
    // let abi = NigeriaService.abi;
    address.map(item => {
      if (item.key === 'NIGERIA_SERVICE_SC_ADDRESS') {
        NIGERIA_SERVICE_SC_ADDRESS = item.value;
      }
    });
    abis.map(item => {
      if (item.key === 'NIGERIA_SERVICE_ABI') {
        abi = JSON.parse(item.value);
      }
    });

    const contract = new ethers.Contract(
      NIGERIA_SERVICE_SC_ADDRESS,
      abi,
      getProvider(),
    );
    const r = await contract.getTransportCard(ticketId);
    const res = [
      r[0].toNumber(), // tokenId
      r[1], // state
      r[2].toHexString(), // serviceDescriptor
      r[3], // user address
      r[4].toNumber(), // credits
      r[5], // erc20Token address
      r[6], // tokenURI
    ];
    console.log('getNFTBalance', res);

    return {
      success: true,
      data: res,
    };
  } catch (e) {
    console.log('Error NFTicket Balance', e);
    return {
      success: false,
    };
  }
}
export function changeNFTBalance(ticketId) {
  return async function (dispatch) {
    try {
      const address = JSON.parse(await deviceStorage.getNFTAddress());
      const abis = JSON.parse(await deviceStorage.getNFTAbi());
      let abi = [];
      // let abi = NigeriaService.abi;
      address.map(item => {
        if (item.key === 'NIGERIA_SERVICE_SC_ADDRESS') {
          NIGERIA_SERVICE_SC_ADDRESS = item.value;
        }
      });
      abis.map(item => {
        if (item.key === 'NIGERIA_SERVICE_ABI') {
          abi = JSON.parse(item.value);
        }
      });

      const contract = new ethers.Contract(
        NIGERIA_SERVICE_SC_ADDRESS,
        abi,
        getProvider(),
      );
      const r = await contract.getTransportCard(ticketId);
      const res = [
        r[0].toNumber(), // tokenId
        r[1], // state
        r[2].toHexString(), // serviceDescriptor
        r[3], // user address
        r[4].toNumber(), // credits
        r[5], // erc20Token address
        r[6], // tokenURI
        ,
      ];
      console.log('changeNFTBalance', res);

      dispatch(setNFTBalance({data: res}));
      return {
        success: true,
        data: res,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
      };
    }
  };
}
// Approve NFTicket
export async function approveNFTicket(ticketId, accountId) {
  try {
    const address = JSON.parse(await deviceStorage.getNFTAddress());
    const abis = JSON.parse(await deviceStorage.getNFTAbi());
    address.map(item => {
      if (item.key === 'NIGERIA_SERVICE_SC_ADDRESS') {
        NIGERIA_SERVICE_SC_ADDRESS = item.value;
      }
      if (item.key === 'NFTICKET_MASTER_SC_ADDRESS') {
        NFTICKET_MASTER_SC_ADDRESS = item.value;
      }
    });
    let abi = [];
    abis.map(item => {
      if (item.key === 'NFTICKET_MASTER_ABI') {
        abi = JSON.parse(item.value);
      }
    });
    const signer = await getSigner();

    const contract = new ethers.Contract(
      NFTICKET_MASTER_SC_ADDRESS,
      abi,
      signer,
    );
    console.log(signer, 'singer');
    const tx = await contract.approve(NIGERIA_SERVICE_SC_ADDRESS, ticketId);
    await tx.wait();

    return {
      success: true,
      // data: res,
    };
  } catch (error) {
    displayEtherErrors(error);
    return {
      success: false,
      data: error,
    };
  }
}
// Approve ERC20Token
export async function approveERC(amount, accountId, contractAddress, spender) {
  try {
    const abis = JSON.parse(await deviceStorage.getNFTAbi());
    // let abi = NGNService.abi;
    let abi = [];
    abis.map(item => {
      if (item.key === 'NGN_TOKEN_ABI') {
        abi = JSON.parse(item.value);
      }
    });
    const address = JSON.parse(await deviceStorage.getNFTAddress());
    address.map(item => {
      if (item.key === 'NFTICKET_MASTER_SC_ADDRESS') {
        NFTICKET_MASTER_SC_ADDRESS = item.value;
      }
    });

    const signer = await getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.approve(spender, ethers.utils.parseEther(amount));
    await tx.wait();

    return {
      success: true,
    };
  } catch (error) {
    displayEtherErrors(error);
    return {
      success: false,
      data: error,
    };
  }
}
// Refund
export async function refund(amount, ticketId, accountId) {
  try {
    const abis = JSON.parse(await deviceStorage.getNFTAbi());
    // let abi = NGNService.abi;
    let abi = [];
    abis.map(item => {
      if (item.key === 'NIGERIA_SERVICE_ABI') {
        abi = JSON.parse(item.value);
      }
    });
    const address = JSON.parse(await deviceStorage.getNFTAddress());
    address.map(item => {
      if (item.key === 'NIGERIA_SERVICE_SC_ADDRESS') {
        NIGERIA_SERVICE_SC_ADDRESS = item.value;
      }
    });

    const signer = await getSigner();
    const contract = new ethers.Contract(
      NIGERIA_SERVICE_SC_ADDRESS,
      abi,
      signer,
    );
    const res = await contract.callStatic.refund(ticketId, amount);
    console.log('refund', res);
    return {
      data: [
        res[0], // withdrawnERC20
        parseFloat(ethers.utils.formatEther(res[1])), // withdrawnAmount
        parseFloat(ethers.utils.formatEther(res[2])), // remainingCredits
      ],
      success: true,
    };
  } catch (error) {
    displayEtherErrors(error);
    return {
      success: false,
      data: error,
    };
  }
}
export async function doRefund(ticketId, amount) {
  try {
    const abis = JSON.parse(await deviceStorage.getNFTAbi());
    // let abi = NGNService.abi;
    let abi = [];
    abis.map(item => {
      if (item.key === 'NIGERIA_SERVICE_ABI') {
        abi = JSON.parse(item.value);
      }
    });
    const address = JSON.parse(await deviceStorage.getNFTAddress());
    address.map(item => {
      if (item.key === 'NIGERIA_SERVICE_SC_ADDRESS') {
        NIGERIA_SERVICE_SC_ADDRESS = item.value;
      }
    });

    const signer = await getSigner();
    const contract = new ethers.Contract(
      NIGERIA_SERVICE_SC_ADDRESS,
      abi,
      signer,
    );
    const tx = await contract.refund(ticketId, amount);
    await tx.wait();
    return {
      success: true,
    };
  } catch (error) {
    displayEtherErrors(error);
    return {
      success: false,
      data: error,
    };
  }
}
// Get Signature
export async function getSignature(accountId, message) {
  try {
    const address = JSON.parse(await deviceStorage.getNFTAddress());
    address.map(item => {
      if (item.key === 'PROCESSOR_CONTRACT_ADDRESS') {
        PROCESSOR_CONTRACT_ADDRESS = item.value;
      }
    });
    // EIP712
    const types = {
      JourneyPayload: [
        {name: 'latitude', type: 'string'},
        {name: 'longitude', type: 'string'},
        {name: 'locationName', type: 'string'},
        {name: 'timestamp', type: 'uint256'},
      ],
    };

    const provider = getProvider();
    const {chainId} = await provider.getNetwork();
    const domain = {
      name: 'NFTicket',
      version: '1',
      verifyingContract: PROCESSOR_CONTRACT_ADDRESS,
      chainId,
    };
    const latitude = message.latitude.toString();
    const longitude = message.longitude.toString();
    const locationName = message.locationName;
    const timestamp = message.timestamp;
    const values = {
      latitude,
      longitude,
      locationName,
      timestamp,
    };
    const signer = await getSigner();
    const signature = await signer._signTypedData(domain, types, values);
    return {
      success: true,
      signature: signature,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
    };
  }
}
// Confirm Signature
export async function confirmSignature(accountId, connector, message) {
  try {
    const signer = await getSigner();
    // Not secured message
    const signature = await signer.signMessage(message);
    return {
      success: true,
      signature: signature,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
    };
  }
}
// Get Signature for login
export async function getSignatureLogin(accountId) {
  try {
    const address = JSON.parse(await deviceStorage.getNFTAddress());
    address.map(item => {
      if (item.key === 'PROCESSOR_CONTRACT_ADDRESS') {
        PROCESSOR_CONTRACT_ADDRESS = item.value;
      }
    });

    const timeStamp = Math.round(Date.now() / 1000);
    const types = {
      LoginPayload: [
        {name: 'walletAddress', type: 'address'},
        {name: 'timestamp', type: 'uint256'},
      ],
    };
    const values = {
      walletAddress: ethers.utils.getAddress(
        String(accountId).toLowerCase().trim(),
      ),
      timestamp: timeStamp,
    };

    const provider = getProvider();
    const {chainId} = await provider.getNetwork();
    const domain = {
      name: 'NFTicket',
      version: '1',
      verifyingContract: PROCESSOR_CONTRACT_ADDRESS,
      chainId,
    };

    const signer = await getSigner();
    const signature = await signer._signTypedData(domain, types, values);
    const res = ethers.utils.verifyTypedData(domain, types, values, signature);

    console.log(signer);
    console.log(res);

    await deviceStorage.setSignature(signature);
    await deviceStorage.setSigTime(timeStamp.toString());
    return {
      success: true,
      signature: signature,
      timeStamp: timeStamp.toString(),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
    };
  }
}
export async function getSignatureLoginV1(accountId) {
  try {
    const address = JSON.parse(await deviceStorage.getNFTAddress());
    address.map(item => {
      if (item.key === 'PROCESSOR_CONTRACT_ADDRESS') {
        PROCESSOR_CONTRACT_ADDRESS = item.value;
      }
    });

    const timeStamp = Math.round(Date.now() / 1000);
    const types = {
      LoginPayload: [
        {name: 'walletAddress', type: 'address'},
        {name: 'timestamp', type: 'uint256'},
      ],
    };
    const values = {
      walletAddress: ethers.utils.getAddress(
        String(accountId).toLowerCase().trim(),
      ),
      timestamp: timeStamp,
    };

    const provider = getProvider();
    const {chainId} = await provider.getNetwork();
    const domain = {
      name: 'NFTicket',
      version: '1',
      verifyingContract: PROCESSOR_CONTRACT_ADDRESS,
      chainId,
    };
    const signer = await getSigner();
    const signature = await signer._signTypedData(domain, types, values);
    const res = ethers.utils.verifyTypedData(domain, types, values, signature);

    await deviceStorage.setSignature(signature);
    await deviceStorage.setSigTime(timeStamp.toString());
    return {
      success: true,
      signature: signature,
      timeStamp: timeStamp.toString(),
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
    };
  }
}
