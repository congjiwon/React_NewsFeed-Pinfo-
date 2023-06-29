import React from 'react';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { auth } from '../../firebase';
import UserProfile from './UserProfile';
import { styled } from 'styled-components';

function PostContainer() {
  const loginUser = useSelector(state => state.user);
  const { email, userName } = loginUser;

  const [users, setUsers] = useState([]);
  const myUser = users.find(user => user.userEmail === email);

  const postDatas = useSelector(state => state.postDatas);
  const myPost = postDatas.filter(post => post.userEmail === email);

  const commentDatas = useSelector(state => state.comments);
  const myComment = commentDatas.filter(comment => comment.userId === email);

  // firebase에 새로운 데이터 저장하기
  useEffect(() => {
    const fetchData = async () => {
      // collection 이름이 users인 collection의 모든 document를 가져옵니다.
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);

      const initialUsers = [];

      querySnapshot.forEach(doc => {
        initialUsers.push({ id: doc.id, ...doc.data() });
      });
      setUsers(initialUsers);
    };
    fetchData();
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '40px'
        }}
      >
        <UserProfile />
        <div>
          <p>닉네임 : </p>
          <p>이메일 : </p>
        </div>
      </div>
      <div>
        <div
          style={{
            width: '700px',
            height: '35px',
            color: 'white',
            backgroundColor: '#12263A',
            margin: '30px auto auto auto',
            textAlign: 'center'
          }}
        >
          <label>작성 글 목록</label>
        </div>
        <div>
          {myPost.map(data => {
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  width: '700px',
                  margin: '10px auto auto auto',
                  textAlign: 'center'
                }}
                key={data.id}
              >
                <p>{data.category}</p>
                <p style={{ width: '330px' }}>{data.title}</p>
                <p>{data.date}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div
          style={{
            width: '700px',
            height: '35px',
            color: 'white',
            backgroundColor: '#12263A',
            margin: '30px auto auto auto',
            textAlign: 'center'
          }}
        >
          <label>작성 댓글 목록</label>
        </div>
        <div>
          {myComment.map(data => {
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  width: '700px',
                  margin: '10px auto auto auto',
                  textAlign: 'center'
                }}
                key={data.id}
              >
                <p>{data.category}</p>
                <p style={{ width: '330px' }}>{data.comment}</p>
                <p>{data.time}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PostContainer;
