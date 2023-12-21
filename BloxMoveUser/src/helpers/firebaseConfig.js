// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// const userDocument = firestore().collection('Users');

// // Firebase
// const handleUserFromAuthStateChanged = (user, resolve) => {
//   if (user) {
//     userDocument
//       .doc(user.uid)
//       .get()
//       .then(document => {
//         const userData = document.data();
//         resolve({...userData, id: user.uid, userID: user.uid});
//       })
//       .catch(error => {
//         resolve(null);
//       });
//   } else {
//     resolve(null);
//   }
// };
// export const tryAlternatePersistedAuthUserRetriever = resolve => {
//   auth().onAuthStateChanged(user => {
//     if (user) {
//       return handleUserFromAuthStateChanged(user, resolve);
//     } else {
//       resolve(null);
//     }
//   });
// };
// export const retrievePersistedAuthUser = () => {
//   return new Promise(resolve => {
//     return auth().onAuthStateChanged(user => {
//       if (user) {
//         return handleUserFromAuthStateChanged(user, resolve);
//       } else {
//         return tryAlternatePersistedAuthUserRetriever(resolve);
//       }
//     });
//   });
// };
// export const loginWithSMSCode = async (confirm, codeInputValue) => {
//   const credential = auth.PhoneAuthProvider.credential(
//     confirm.verificationId,
//     codeInputValue,
//   );
//   return new Promise(function (resolve, _reject) {
//     auth()
//       .signInWithCredential(credential)
//       .then(result => {
//         if (result.additionalUserInfo.isNewUser) {
//           resolve({error: 'Not exist'});
//         } else {
//           userDocument
//             .doc(result.user.uid)
//             .get()
//             .then(function (firestoreDocument) {
//               if (!firestoreDocument.exists) {
//                 resolve({error: 'Not exist'});
//                 return;
//               }
//               const userData = firestoreDocument.data();
//               resolve({user: userData});
//             })
//             .catch(function (_error) {
//               resolve({error: _error});
//             });
//         }
//       })
//       .catch(_error => {
//         resolve({error: _error});
//       });
//   });
// };

// export const removeUser = userID => {
//   return new Promise(resolve => {
//     userDocument
//       .doc(userID)
//       .delete()
//       .then(() => {
//         auth()
//           .currentUser.delete()
//           .then(() => {
//             resolve({success: true});
//           })
//           .catch(error => {
//             let errorCode = '';
//             resolve({success: false, error: errorCode});
//           });
//       })
//       .catch(error => {
//         console.log(error);
//         resolve({success: false, error});
//       });
//   });
// };

// export const updateUser = async (userID, newData) => {
//   const dataWithOnlineStatus = {
//     ...newData,
//     lastOnlineTimestamp: firestore.FieldValue.serverTimestamp(),
//   };
//   return await userDocument
//     .doc(userID)
//     .set({...dataWithOnlineStatus}, {merge: true});
// };
