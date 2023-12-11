import React from 'react';
import Bare from '../Bare.js';
import '../style/home.css'
import 'https://unpkg.com/@splinetool/viewer@0.9.521/build/spline-viewer.js'


const Home = () => {
  return (
    <>
      <Bare/>
      <section className='heroHome'>
        <spline-viewer url="https://prod.spline.design/m0yLMxXElJDlispH/scene.splinecode" loading="eager"></spline-viewer>
        <div className='cd_content_home'>
        <img src="/separator.svg" alt="futurist separator" />
        <div className='cd_game'>
          <h1>
          Your Ultimate To-Do App!
          </h1>
          <p>Boost productivity effortlessly! TaskSwift redefines task management with a sleek, powerful user experience. Elevate your to-do lists to goal-conquering mastery. Say goodbye to stress, stay organized, and achieve peak productivity with TaskSwift today!</p>
        </div>
        <img src="/separator.svg" alt="futurist separator" />
        </div>
        
      </section>
    </>
  );
};

export default Home;
