import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import PostContainer from './PostContainer';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth, db } from '../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { updateDoc, doc } from 'firebase/firestore';
import { changePhoto } from '../../redux/modules/user';

function UserProfile() {
  const dispatch = useDispatch();
  const user = useSelector(state => {
    return state.user;
  });

  const updateImg = async file => {
    // 파일을 받아 스토리지에 저장
    const imageRef = ref(storage, `profileImg/${auth.currentUser.email}`);
    await uploadBytes(imageRef, file);
    // 스토리지에 저장된 파일의 url을 받아와 변수에 저장.
    const newImageRef = ref(storage, `profileImg/${auth.currentUser.email}`);
    const url = await getDownloadURL(newImageRef);
    // 받아온 url을 db users에 저장시킨다.
    const collectionRef = doc(db, 'users', user.docId);
    await updateDoc(collectionRef, { photoUrl: url });
    // dispatch(changePhoto({ url: url })); // payload:{url: url}
    dispatch(changePhoto(url)); // payload: url
  };

  const handleImgUpload = event => {
    updateImg(event.target.files[0]);
  };

  return (
    <div>
      <ProfileImg profileimg={user.photoURL} />
      <FileInput type="file" accept="image/jpg, image/jpeg, image/png" onChange={handleImgUpload} />
    </div>
  );
}

const ProfileImg = styled.div`
  width: 240px;
  height: 240px;
  border: 1px solid;
  border-radius: 50%;
  /* display: inline-flex; */
  background-image: url(${props => props.profileimg});
  background-size: contain;
  background-position: center;
`;

const FileInput = styled.input`
  width: 120px;
  margin-top: 20px;
`;

export default UserProfile;
