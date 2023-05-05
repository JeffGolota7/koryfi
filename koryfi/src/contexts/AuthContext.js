import React, { useContext, useState, useEffect } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  db,
} from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { sendPasswordResetEmail, updateCurrentUser } from "firebase/auth";
import { useBannerContext } from "./BannerProvider.js";
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const { setVisible, setMessage } = useBannerContext();
  const [currentUser, setCurrentUser] = useState();
  const [isLoading, setLoading] = useState(true);

  function signup(email, password) {
    sendSignUpEmail(email);
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function forgotPassword(email) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage("Email Sent");
        setVisible(true);
      })
      .catch((e) => {
        setMessage(e.error);
        setVisible(true);
      });
  }

  function sendSignUpEmail(email) {
    const emailConfig = {
      Username: "koryfisportsinfo@gmail.com",
      Password: "4BA4A52CCEBC3C50F48570A37B17A5B2C80B",
      Host: "smtp.elasticemail.com",
      Port: 2525,
      To: email,
      From: "koryfisportsinfo@gmail.com",
      Subject: "Welcome to the Family!",
      Body: `<!DOCTYPE html>
<html>
<head>
	<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
		<tbody><tr>
			<td align="center">
				<table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
					<tbody><tr>
						<td align="center" valign="top" background="https://images.unsplash.com/photo-1559208722-abb22e0e918e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1631&q=80" bgcolor="#FFCC00" style="background-size:cover; background-position:top;height=" 400""="">
							<table class="col-600" width="600" height="400" border="0" align="center" cellpadding="0" cellspacing="0">
								<tbody><tr>
									<td height="40"></td>
								</tr>
								<tr>
									<td align="center" style="font-family: 'Raleway', sans-serif; font-size:37px; color:#ffffff; line-height:24px; font-weight: bold; letter-spacing: 7px;">
										WELCOME <span style="font-family: 'Raleway', sans-serif; font-size:37px; color:#ffffff; line-height:39px; font-weight: 300; letter-spacing: 7px;">TO THE FAMILY</span>
									</td>
								</tr>
								<tr>
									<td align="center" style="font-family: 'Lato', sans-serif; font-size:15px; color:#ffffff; line-height:24px; font-weight: 300;">
										We're happy to have you
									</td>
								</tr>
								<tr>
									<td height="50"></td>
								</tr>
							</tbody></table>
						</td>
					</tr>
				</tbody></table>
			</td>
		</tr>
		<tr>
			<td align="center">
				<table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left:20px; margin-right:20px; border-left: 1px solid #dbd9d9; border-right: 1px solid #dbd9d9;">
					<tbody><tr>
						<td height="35"></td>
					</tr>
					<tr>
						<td align="center" style="font-family: 'Raleway', sans-serif; font-size:22px; font-weight: bold; color:#2a3a4b;">Now that you're here...</td>
					</tr>
					<tr>
						<td height="10"></td>
					</tr>
					<tr>
						<td align="center" style="font-family: 'Lato', sans-serif; font-size:14px; color:#757575; line-height:24px; font-weight: 300;">
							Check out what we have to offer<br>
							You won't regret it
						</td>
					</tr>
				</tbody></table>
			</td>
		</tr>

		<tr>
			<td align="center">
				<table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="border-left: 1px solid #dbd9d9; border-right: 1px solid #dbd9d9; ">
					<tbody><tr>
						<td height="10"></td>
					</tr>
					<tr>
						<td>


							<table class="col3" width="183" border="0" align="left" cellpadding="0" cellspacing="0">
								<tbody><tr>
									<td height="30"></td>
								</tr>
								<tr>
									<td align="center">
										<table class="insider" width="133" border="0" align="center" cellpadding="0" cellspacing="0">
											<tr>
												<td height="15"></td>
											</tr>
											<tr align="center">
												<td style="font-family: 'Raleway', Arial, sans-serif; font-size:20px; color:#2b3c4d; line-height:24px; font-weight: bold;">See How We Got Here</td>
											</tr>
											<tr>
												<td height="10"></td>
											</tr>
											<tr align="center">
												<td style="font-family: 'Lato', sans-serif; font-size:14px; color:#757575; line-height:24px; font-weight: 300;"><a href="http://koryfisports.com/about" style="color:#ffffff;">About</a></td>
											</tr>
										</tbody></table>
									</td>
								</tr>
								<tr>
									<td height="30"></td>
								</tr>
							</tbody></table>
							<table width="1" height="20" border="0" cellpadding="0" cellspacing="0" align="left">
								<tbody><tr>
									<td height="20" style="font-size: 0;line-height: 0;border-collapse: collapse;">
										<p style="padding-left: 24px;">&nbsp;</p>
									</td>
								</tr>
							</tbody></table>
							<table class="col3" width="183" border="0" align="left" cellpadding="0" cellspacing="0">
								<tbody><tr>
									<td height="30"></td>
								</tr>
								<tr>
									<td align="center">
										<table class="insider" width="133" border="0" align="center" cellpadding="0" cellspacing="0">

											<tbody>
											<tr>
												<td height="15"></td>
											</tr>
											<tr align="center">
												<td style="font-family: 'Raleway', sans-serif; font-size:20px; color:#2b3c4d; line-height:24px; font-weight: bold;">Browse Our Catalog</td>
											</tr>
											<tr>
												<td height="10"></td>
											</tr>


											<tr align="center">
													<td style="font-family: 'Lato', sans-serif; font-size:14px; color:#757575; line-height:24px; font-weight: 300;"><a href="http://koryfisports.com/products" style="color:#ffffff;">About</a></td>
											</tr>



										</tbody></table>
									</td>
								</tr>
								<tr>
									<td height="30"></td>
								</tr>
							</tbody></table>



							<table width="1" height="20" border="0" cellpadding="0" cellspacing="0" align="left">
								<tbody><tr>
									<td height="20" style="font-size: 0;line-height: 0;border-collapse: collapse;">
										<p style="padding-left: 24px;">&nbsp;</p>
									</td>
								</tr>
							</tbody></table>



							<table class="col3" width="183" border="0" align="right" cellpadding="0" cellspacing="0">
								<tbody><tr>
									<td height="30"></td>
								</tr>
								<tr>
									<td align="center">
										<table class="insider" width="133" border="0" align="center" cellpadding="0" cellspacing="0">

											<tbody><tr align="center" style="line-height:0px;">
												<td>
													<img style="display:block; line-height:0px; font-size:0px; border:0px;" src="https://designmodo.com/demo/emailtemplate/images/icon-portfolio.png" width="69" height="78" alt="icon">
												</td>
											</tr>


											<tr>
												<td height="15"></td>
											</tr>


											<tr align="center">
												<td style="font-family: 'Raleway',  sans-serif; font-size:20px; color:#2b3c4d; line-height:24px; font-weight: bold;">Our Portfolio</td>
											</tr>


											<tr>
												<td height="10"></td>
											</tr>


											<tr align="center">
												<td style="font-family: 'Lato', sans-serif; font-size:14px; color:#757575; line-height:24px; font-weight: 300;">Place some cool text here.</td>
											</tr>

										</tbody></table>
									</td>
								</tr>
								<tr>
									<td height="30"></td>
								</tr>
							</tbody></table>


						</td>
					</tr>
				</tbody></table>
			</td>
		</tr>

			<tr>
					<td height="5"></td>
		</tr>


<!-- END 3 BOX SHOWCASE -->


<!-- START AWESOME TITLE -->

		<tr>
			<td align="center">
				<table align="center" class="col-600" width="600" border="0" cellspacing="0" cellpadding="0">
					<tbody><tr>
						<td align="center" bgcolor="#2a3b4c">
							<table class="col-600" width="600" align="center" border="0" cellspacing="0" cellpadding="0">
								<tbody><tr>
									<td height="33"></td>
								</tr>
								<tr>
									<td>


										<table class="col1" width="183" border="0" align="left" cellpadding="0" cellspacing="0">

											<tbody><tr>
											<td height="18"></td>
											</tr>

											<tr>
												<td align="center">
													<img style="display:block; line-height:0px; font-size:0px; border:0px;" class="images_style" src="https://designmodo.com/demo/emailtemplate/images/icon-title.png" alt="img" width="156" height="136">
												</td>



											</tr>
										</tbody></table>



										<table class="col3_one" width="380" border="0" align="right" cellpadding="0" cellspacing="0">

											<tbody><tr align="left" valign="top">
												<td style="font-family: 'Raleway', sans-serif; font-size:20px; color:#f1c40f; line-height:30px; font-weight: bold;">This title is definitely awesome! </td>
											</tr>


											<tr>
												<td height="5"></td>
											</tr>


											<tr align="left" valign="top">
												<td style="font-family: 'Lato', sans-serif; font-size:14px; color:#fff; line-height:24px; font-weight: 300;">
													The use of flat colors in web design is more than a recent trend, it is a style designers have used for years to create impactful visuals. When you hear "flat", it doesn't mean boring it just means minimalist.
												</td>
											</tr>

											<tr>
												<td height="10"></td>
											</tr>

											<tr align="left" valign="top">
												<td>
													<table class="button" style="border: 2px solid #fff;" bgcolor="#2b3c4d" width="30%" border="0" cellpadding="0" cellspacing="0">
														<tbody><tr>
															<td width="10"></td>
															<td height="30" align="center" style="font-family: 'Open Sans', Arial, sans-serif; font-size:13px; color:#ffffff;">
																<a href="#" style="color:#ffffff;">Read more</a>
															</td>
															<td width="10"></td>
														</tr>
													</tbody></table>
												</td>
											</tr>

										</tbody></table>
									</td>
								</tr>
								<tr>
									<td height="33"></td>
								</tr>
							</tbody></table>
						</td>
					</tr>
				</tbody></table>
			</td>
		</tr>


<!-- END AWESOME TITLE -->


<!-- START WHAT WE DO -->

		<tr>
			<td align="center">
				<table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left:20px; margin-right:20px;">



		<tbody><tr>
			<td align="center">
				<table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style=" border-left: 1px solid #dbd9d9; border-right: 1px solid #dbd9d9;">
					<tbody><tr>
						<td height="50"></td>
					</tr>
					<tr>
						<td align="right">


							<table class="col2" width="287" border="0" align="right" cellpadding="0" cellspacing="0">
								<tbody><tr>
									<td align="center" style="line-height:0px;">
										<img style="display:block; line-height:0px; font-size:0px; border:0px;" class="images_style" src="https://designmodo.com/demo/emailtemplate/images/icon-responsive.png" width="169" height="138">
									</td>
								</tr>
							</tbody></table>






							<table width="287" border="0" align="left" cellpadding="0" cellspacing="0" class="col2" style="">
								<tbody><tr>
									<td align="center">
										<table class="insider" width="237" border="0" align="center" cellpadding="0" cellspacing="0">



											<tbody><tr align="left">
												<td style="font-family: 'Raleway', sans-serif; font-size:23px; color:#2a3b4c; line-height:30px; font-weight: bold;">What we do?</td>
											</tr>

											<tr>
												<td height="5"></td>
											</tr>


											<tr>
												<td style="font-family: 'Lato', sans-serif; font-size:14px; color:#7f8c8d; line-height:24px; font-weight: 300;">
													We create responsive websites with modern designs and features for small businesses and organizations that are professionally developed and SEO optimized.
												</td>
											</tr>


										</tbody></table>
									</td>
								</tr>
							</tbody></table>
						</td>
					</tr>
				</tbody></table>
			</td>
		</tr>


<!-- END WHAT WE DO -->



<!-- START READY FOR NEW PROJECT -->

		<tr>
			<td align="center">
				<table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" style=" border-left: 1px solid #dbd9d9; border-right: 1px solid #dbd9d9;">
					<tbody><tr>
						<td height="50"></td>
					</tr>
					<tr>


						<td align="center" bgcolor="#34495e">
							<table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
								<tbody><tr>
									<td height="35"></td>
								</tr>


								<tr>
									<td align="center" style="font-family: 'Raleway', sans-serif; font-size:20px; color:#f1c40f; line-height:24px; font-weight: bold;">Ready for new project?</td>
								</tr>


								<tr>
									<td height="20"></td>
								</tr>


								<tr>
									<td align="center" style="font-family: 'Lato', sans-serif; font-size:14px; color:#fff; line-height: 1px; font-weight: 300;">
										Check out our price below.
									</td>
								</tr>


								<tr>
									<td height="40"></td>
								</tr>

							</tbody></table>
						</td>
					</tr>
				</tbody></table>
			</td>
		</tr>


<!-- END READY FOR NEW PROJECT -->


<!-- START PRICING TABLE -->

		<tr>
			<td align="center">
				<table width="600" class="col-600" align="center" border="0" cellspacing="0" cellpadding="0" style=" border-left: 1px solid #dbd9d9; border-right: 1px solid #dbd9d9;">
					<tbody><tr>
						<td height="50"></td>
					</tr>
					<tr>
						<td>


							<table style="border:1px solid #e2e2e2;" class="col2" width="287" border="0" align="left" cellpadding="0" cellspacing="0">


								<tbody><tr>
									<td height="40" align="center" bgcolor="#2b3c4d" style="font-family: 'Raleway', sans-serif; font-size:18px; color:#f1c40f; line-height:30px; font-weight: bold;">Small Business Website</td>
								</tr>


								<tr>
									<td align="center">
										<table class="insider" width="237" border="0" align="center" cellpadding="0" cellspacing="0">
											<tbody><tr>
												<td height="20"></td>
											</tr>

											<tr align="center" style="line-height:0px;">
												<td style="font-family: 'Lato', sans-serif; font-size:48px; color:#2b3c4d; font-weight: bold; line-height: 44px;">$150</td>
											</tr>


											<tr>
												<td height="15"></td>
											</tr>


											<tr>
												<td height="15"></td>
											</tr>



											<tr>
												<td align="center">
													<table width="100" border="0" align="center" cellpadding="0" cellspacing="0" style="border: 2px solid #2b3c4d;">
														<tbody><tr>
															<td width="10"></td>
															<td height="30" align="center" style="font-family: 'Lato', sans-serif; font-size:14px; font-weight: 300; color:#2b3c4d;">
																<a href="#" style="color: #2b3c4d;">Learn More</a>
															</td>
															<td width="10"></td>
														</tr>
													</tbody></table>
												</td>
											</tr>


										</tbody></table>
									</td>
								</tr>
								<tr>
									<td height="30"></td>
								</tr>
							</tbody></table>





							<table width="1" height="20" border="0" cellpadding="0" cellspacing="0" align="left">
								<tbody><tr>
									<td height="20" style="font-size: 0;line-height: 0;border-collapse: collapse;">
										<p style="padding-left: 24px;">&nbsp;</p>
									</td>
								</tr>
							</tbody></table>


							<table style="border:1px solid #e2e2e2;" class="col2" width="287" border="0" align="right" cellpadding="0" cellspacing="0">


								<tbody><tr>
									<td height="40" align="center" bgcolor="#2b3c4d" style="font-family: 'Raleway', sans-serif; font-size:18px; color:#f1c40f; line-height:30px; font-weight: bold;">E-commerce Website</td>
								</tr>


								<tr>
									<td align="center">
										<table class="insider" width="237" border="0" align="center" cellpadding="0" cellspacing="0">
											<tbody><tr>
												<td height="20"></td>
											</tr>

											<tr align="center" style="line-height:0px;">
												<td style="font-family: 'Lato', sans-serif; font-size:48px; color:#2b3c4d; font-weight: bold; line-height: 44px;">$289</td>
											</tr>


											<tr>
												<td height="30"></td>
											</tr>



											<tr align="center">
												<td>
													<table width="100" border="0" align="center" cellpadding="0" cellspacing="0" style=" border: 2px solid #2b3c4d;">
														<tbody><tr>
															<td width="10"></td>
															<td height="30" align="center" style="font-family: 'Lato', sans-serif; font-size:14px; font-weight: 300; color:#2b3c4d;">
																<a href="#" style="color: #2b3c4d;">Learn More</a>
															</td>
															<td width="10"></td>
														</tr>
													</tbody></table>
												</td>
											</tr>


										</tbody></table>
									</td>
								</tr>
								<tr>
									<td height="20"></td>
								</tr>
							</tbody></table>

						</td>
					</tr>
				</tbody></table>
			</td>
		</tr>


<!-- END PRICING TABLE -->


						
		
				</tbody></table>
</html>`,
    };

    if (window.Email) {
      window.Email.send(emailConfig).then((message) => {
        setMessage(message);
        setVisible(true);
      });
    }
  }

  async function getUserFromDatabase(user) {
    const docRef = doc(db, "users", user.uid);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return await docSnap;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function editDataField(user, fieldName, newValue) {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userRef, {
          [fieldName]: newValue,
        });
        setMessage("Field Updated");
        setVisible(true);
        user[fieldName] = newValue;
      } catch (e) {
        setMessage(e);
        setVisible(true);
      }
    }
  }

  async function addAddress(user, address) {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        const userSnap = await getDoc(userRef);
        const user = userSnap.data();
        let addresses = [];

        if (user.shippingAddresses) {
          addresses = user.shippingAddresses;
        }
        addresses.push(address);
        await updateDoc(userRef, {
          shippingAddresses: addresses,
        });
        setMessage("Address Successfully Added");
        setVisible(true);
        user.shippingAddresses = addresses;
      } catch (e) {
        alert(e);
      }
    }
  }

  async function addCardToAccount(user, card) {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        const userSnap = await getDoc(userRef);
        const user = userSnap.data();
        let cards = [];

        if (!user.paymentMethods) {
          cards.push(card);
        } else {
          cards = user.paymentMethods;
        }
        await updateDoc(userRef, {
          paymentMethods: cards,
        });
        setMessage("Card Successfully Added");
        setVisible(true);
        user.paymentMethods = cards;
      } catch (e) {
        alert(e);
      }
    }
  }
  async function updatePurchaseHistory(user, cart) {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        const userSnap = await getDoc(userRef);
        const user = userSnap.data();

        let purchaseHistoryTemp = user.purchaseHistory || [];

        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const year = today.getFullYear();
        const formattedDate = `${month.toString().padStart(2, "0")}/${day
          .toString()
          .padStart(2, "0")}/${year.toString()}`;
        const totalPrice = cart.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.price;
        }, 0);

        const purchase = {
          itemsPurchased: cart,
          date: formattedDate,
          total: totalPrice.toFixed(2),
        };

        purchaseHistoryTemp.push(purchase);
        console.log(purchaseHistoryTemp);
        await updateDoc(userRef, {
          purchaseHistory: purchaseHistoryTemp,
        });
        const currentUserContext = currentUser;
        currentUserContext.purchaseHistory = purchaseHistoryTemp;
        setCurrentUser(currentUserContext);
      } catch (e) {
        alert(e);
      }
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const data = await getUserFromDatabase(user);
        if (data) {
          let uid = user.uid;
          user = data.data();
          user.uid = uid;
        }
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    setCurrentUser(currentUser);
  }, [currentUser]);

  const value = {
    currentUser,
    editDataField,
    addAddress,
    addCardToAccount,
    updatePurchaseHistory,
    sendSignUpEmail,
    forgotPassword,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
