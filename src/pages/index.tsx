import { GetStaticProps } from 'next'
import Head from 'next/head'
import styles from '../styles/styles.module.scss'
import firebase from '../../src/services/firebaseConnection'
import { useState } from 'react'
import Image from 'next/image'
import boardUser from '../../../public/images/board-user.svg'

type Data = {
  id: string,
  image: string,
  donate: boolean,
  lastDonate: Date
}
interface HomeProps {
  data: string,
}

export default function Home({ data }: HomeProps) {
  const [donaters, setDonaters] = useState<Data[]>(JSON.parse(data))
  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas.</title>
      </Head>
      <main className={styles.contentContainer}>
        <Image src={boardUser} alt='' />
        <section className={styles.callToAction}>
          <h1>Uma ferramenta para seu dia a dia Escreva, pleneje e organize-se..</h1>
          <p>
            <span>100% Gratuita</span> e online.
          </p>
        </section>
        {donaters.length != 0 && <h3>Apoiadores:</h3>}
        <div className={styles.donaters}>
          {donaters.map(item => (
            <Image width={65} height={65} key={item.image} src={item.image} alt="Usuario" />
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const donaters = await firebase.firestore().collection('users').get()
  const data = JSON.stringify(donaters.docs.map(u => {
    return {
      id: u.id,
      ...u.data()
    }
  }))
  return {
    props: {
      data
    },
    revalidate: 60 * 60
  }
}