import React from 'react';
import Navbar from '@/components/Navbar';
import Heading from '@/components/Heading';
import specialcards from './data';
import Image from 'next/image';
import Footer from '@/components/Footer';

function Play() {
  return (
    <>
      <div className="text-white min-h-screen pb-10"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
            radial-gradient(circle at 80% 90%, rgba(245, 0, 79, 0.15) 5%, transparent 60%),
            #040811
          `
        }}>
        <Navbar />
        <section className='mt-10 py-6 w-[90%] lg:w-[85%] mx-auto rounded-xl'>
          <Heading headingname='How to Play' />
          <div className='bg-formcolor flex flex-col justify-center items-center py-5 mt-10 px-5'>
            <h1 className='text-3xl font-headingfont text-custompink py-2 text-center'>Objective of Plyzo</h1>
            <p className='text-xl font-bodyfont py-2 text-center'>The goal of Plyzo is to be the first player to discard all of your cards.</p>

            <div className='flex flex-col lg:flex-row w-full justify-between items-center p-5 gap-5'>
              <div className='flex flex-col justify-center items-start w-full lg:w-[70%] p-5'>
                <h2 className='text-3xl pb-2 font-headingfont text-custompink'>Game Setup</h2>
                <ul className='text-md font-bodyfont list-disc px-5'>
                  <li>The deck is shuffled, and each player receives 8 random cards.</li>
                  <li>The top card from the deck is placed in the center to form the discard pile.</li>
                  <li>The first player's turn begins, with turns proceeding in the indicated direction.</li>
                  <li>A Reverse card can change the turn direction (see Special Cards below).</li>
                </ul>
              </div>
              <div className='flex justify-center'>
                <Image
                  src="https://placehold.co/400x400/png"
                  alt="Placeholder Image"
                  width={200}
                  height={200}
                  className='rounded-lg'
                />
              </div>
            </div>

            <div className='flex flex-col lg:flex-row-reverse w-full justify-between items-center p-5 gap-5'>
              <div className='flex flex-col justify-center items-start w-full lg:w-[70%] p-5'>
                <h2 className='text-3xl pb-2 font-headingfont text-custompink'>How to Play</h2>
                <p className='text-lg font-bodyfont py-0'>On their turn, a player must:</p>
                <ul className='text-md font-bodyfont list-decimal px-5 mt-3'>
                  <li>Play a card that matches the color, number, or symbol of the top card on the discard pile.</li>
                  <li>Play an Ocho Wild or Wild Draw 4 card (see Special Cards).</li>
                  <li>Draw a card from the deck if no playable card is available.</li>
                </ul>
              </div>
              <div className='flex justify-center'>
                <Image
                  src="https://placehold.co/400x400/png"
                  alt="Placeholder Image"
                  width={200}
                  height={200}
                  className='rounded-lg'
                />
              </div>
            </div>

            <div className='flex flex-col w-full p-5'>
              <h1 className='w-full my-5 flex justify-center items-center  text-center'>
                <span className='text-2xl font-headingfont text-custompink'>Special Cards & Their<span className='text-3xl text-white ml-2  font-dripfont'>Effects</span></span>
                
              </h1>

              <div className='w-full py-3 grid grid-cols-1 lg:grid-cols-2 gap-5'>
                {specialcards.map((card, index) => (
                  <div key={index} className='flex flex-col md:flex-row w-full p-3 justify-center items-center gap-5'>
                    <Image
                      src={card.image}
                      alt="Card Image"
                      width={200}
                      height={200}
                      className='rounded-lg'
                    />
                    <div className='px-5 py-4 flex w-full md:w-[300px] flex-col justify-center items-start text-center md:text-left'>
                      <h2 className='font-headingfont text-3xl'>{card.title}</h2>
                      <p className='font-bodyfont text-md font-thin'>{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Play;
