"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../store/slices/isLoading.slice";
import { apiGetUserById } from "../service/apiGetUserById";
import { apiUpdateUser } from "../service/apiUpdateUser";
import { apiLogin } from "../service/apiLogin";
import { apiUpdatePassword } from "../service/apiUpdatePassword";

const I = {
  user: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  mail: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>,
  lock: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};

const MyAccountCard = () => {
  const userId = useSelector((state) => state.user);
  const userIdToUpdate = useSelector((state) => state.userIdToUpdate);
  const dispatch = useDispatch();
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setconfPassword] = useState("");
  const [passwordMatch, setPasswordsMatch] = useState(true);
  const [oldPassword, setOldPassowrd] = useState();
  const [oldEmail, setOldEmail] = useState();
  const [error, setError] = useState("");
  let backUpUserId;
  let backUpUserIdToUpdate;
  if (typeof window !== "undefined") {
    backUpUserId = localStorage.getItem("userId");
    backUpUserIdToUpdate = localStorage.getItem("userIdToUpdate");
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    checkPasswordsMatch(e.target.value, confPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setconfPassword(e.target.value);
    checkPasswordsMatch(password, e.target.value);
  };

  const checkPasswordsMatch = (pwd1, pwd2) => {
    setPasswordsMatch(pwd1 === pwd2);
  };

  const updateNameAndEmail = async () => {
    if (!fullName.length || !email.length) {
      return setError("Complete information");
    } else if (!email.includes("@") || !email.includes(".")) {
      return setError("Enter valid email");
    } else {
      dispatch(setIsLoading(true));
      let data = {
        fullName: fullName,
        email: email.toLowerCase(),
      };
      setError("");
      if (!userIdToUpdate && !backUpUserIdToUpdate) {
        let result = await apiUpdateUser(userId ? userId : backUpUserId, data);
        if (result.status == 200) {
          setOldEmail(email);
          dispatch(setIsLoading(false));
          alert("User updated successfully");
          window.location.reload();
        } else {
          dispatch(setIsLoading(false));
          setError("Could not update user, incorrect information.");
          console.log(result);
        }
      } else {
        let result = await apiUpdateUser(
          userIdToUpdate ? userIdToUpdate : backUpUserIdToUpdate,
          data
        );
        if (result.status == 200) {
          setOldEmail(email);
          dispatch(setIsLoading(false));
          alert("User updated successfully");
          window.location.reload();
        } else {
          dispatch(setIsLoading(false));
          setError("Could not update user, incorrect information.");
          console.log(result);
        }
      }
    }
  };

  const updatePassword = async () => {
    if (!passwordMatch) return alert("Passwords don't match");
    dispatch(setIsLoading(true));

    // Admin acting on ANOTHER account is authorised by its token; it cannot know
    // that user's current password, so skip the old-password re-check. A user
    // changing their OWN password must confirm the current one.
    const otherAccount = userIdToUpdate || backUpUserIdToUpdate;
    if (!otherAccount) {
      const result = await apiLogin({
        email: email == oldEmail ? email.toLowerCase() : oldEmail.toLowerCase(),
        password: oldPassword,
      });
      if (result?.status != 200) {
        alert("Wrong old password");
        dispatch(setIsLoading(false));
        return;
      }
    }

    const target = otherAccount ? otherAccount : (userId ? userId : backUpUserId);
    const res = await apiUpdatePassword(target, password);
    dispatch(setIsLoading(false));
    if (res?.status == 200) {
      alert("Password updated successfully");
      window.location.reload();
    } else {
      console.log(res);
    }
  };

  const getUserData = async () => {
    if (!userIdToUpdate && !backUpUserIdToUpdate) {
      const userData = await apiGetUserById(userId ? userId : backUpUserId);
      setOldEmail(userData?.email);
      setEmail(userData?.email);
      setfullName(userData?.fullName);
    } else {
      const userData = await apiGetUserById(
        userIdToUpdate ? userIdToUpdate : backUpUserIdToUpdate
      );
      setOldEmail(userData?.email);
      setEmail(userData?.email);
      setfullName(userData?.fullName);
    }
  };

  useEffect(() => {
    setPasswordsMatch(password == confPassword);
  }, [confPassword, password]);

  useEffect(() => {
    getUserData();
  }, []);

  const pwBorder =
    passwordMatch && password.length > 0
      ? "#1f8a52"
      : !passwordMatch && password.length > 0
      ? "#c0392b"
      : undefined;

  return (
    <div className="ac">
      <div className="ac-card">
        <header className="ac-head">
          <h1 className="ac-title">Account settings</h1>
          <p className="ac-sub">Update your profile and password.</p>
        </header>

        {/* Profile */}
        <section className="ac-sec">
          <h2 className="ac-sec-t">Profile</h2>
          <div className="ac-field">
            <span className="ac-ic">{I.user}</span>
            <input className="ac-input" placeholder="Full name" type="text" value={fullName || ""} onChange={(e) => setfullName(e.target.value)} />
          </div>
          <div className="ac-field">
            <span className="ac-ic">{I.mail}</span>
            <input className="ac-input" placeholder="Email address" type="email" value={email || ""} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button className="ac-btn primary" onClick={updateNameAndEmail}>Update name &amp; email</button>
        </section>

        <div className="ac-divider" />

        {/* Password */}
        <section className="ac-sec">
          <h2 className="ac-sec-t">Password</h2>
          <div className="ac-field">
            <span className="ac-ic">{I.lock}</span>
            <input className="ac-input" placeholder="Current password" type="password" onChange={(e) => setOldPassowrd(e.target.value)} />
          </div>
          <div className="ac-field">
            <span className="ac-ic">{I.lock}</span>
            <input className="ac-input" placeholder="New password" type="password" value={password} style={pwBorder ? { borderColor: pwBorder } : {}} onChange={handlePasswordChange} />
          </div>
          <div className="ac-field">
            <span className="ac-ic">{I.lock}</span>
            <input className="ac-input" placeholder="Confirm new password" type="password" value={confPassword} style={pwBorder ? { borderColor: pwBorder } : {}} onChange={handleConfirmPasswordChange} />
          </div>
          {!passwordMatch && password.length > 0 && <p className="ac-hint err">Passwords don’t match.</p>}
          <button className="ac-btn" onClick={updatePassword}>Update password</button>
        </section>

        {!!error.length && <p className="ac-err">Error: {error}</p>}
      </div>

      <style jsx>{`
        .ac { min-height: 70vh; background: radial-gradient(ellipse 100% 40% at 50% 0%, #eef4ff 0%, #eef2f9 55%); padding: 48px 20px 70px; font-family: "Chivo", system-ui, -apple-system, sans-serif; }
        .ac-card { max-width: 480px; margin: 0 auto; background: #fff; border: 1px solid #e6ecf5; border-radius: 18px; box-shadow: 0 12px 40px -22px rgba(10,26,51,.28); padding: 32px 30px; }
        .ac-head { margin-bottom: 22px; }
        .ac-title { font-size: 1.5rem; font-weight: 800; color: #0e2c5c; margin: 0 0 6px; letter-spacing: -.01em; }
        .ac-sub { font-size: 14px; color: #5a6a85; margin: 0; }
        .ac-sec-t { font-size: 12px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: #9aa3b5; margin: 0 0 12px; }
        .ac-field { display: flex; align-items: center; gap: 10px; border: 1.5px solid #e3e9f2; background: #f7f9fc; border-radius: 12px; padding: 0 14px; margin-bottom: 12px; transition: border-color .15s, box-shadow .15s, background .15s; }
        .ac-field:focus-within { border-color: #2f6fe0; background: #fff; box-shadow: 0 0 0 3px rgba(47,111,224,.12); }
        .ac-ic { color: #8a93a6; display: grid; place-items: center; flex-shrink: 0; }
        .ac-input { flex: 1; border: none; outline: none; background: transparent; padding: 12px 0; font-size: 14.5px; color: #0e2c5c; }
        .ac-input::placeholder { color: #9aa3b5; }
        .ac-btn { width: 100%; border: 1.5px solid #dce4ef; background: #f1f4f9; color: #2a3c5a; border-radius: 100px; padding: 11px 18px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background .15s, transform .15s; margin-top: 4px; }
        .ac-btn:hover { background: #e7ecf4; }
        .ac-btn.primary { border-color: transparent; background: linear-gradient(135deg,#4D8DFF,#2f6fe0); color: #fff; box-shadow: 0 8px 20px -8px rgba(47,111,224,.55); }
        .ac-btn.primary:hover { transform: translateY(-1px); }
        .ac-divider { height: 1px; background: #eef2f8; margin: 22px 0; }
        .ac-hint { font-size: 12.5px; margin: -4px 0 10px; }
        .ac-hint.err { color: #c0392b; font-weight: 600; }
        .ac-err { color: #c0392b; font-size: 13px; font-weight: 600; margin: 14px 0 0; }
      `}</style>
    </div>
  );
};

export default MyAccountCard;
