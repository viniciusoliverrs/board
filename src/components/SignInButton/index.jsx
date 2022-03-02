import styles from './styles.module.scss'
import { FaGithub } from 'react-icons/fa'
import { signIn, signOut, useSession } from 'next-auth/client'
import Image from 'next/image'
export function SignInButton() {
    const [session] = useSession()
    return session ? (
        <button
            type='button'
            className={styles.signInButton}
            onClick={() => signOut()}
        >
            <div>
                <Image objectFit='fill' width={35} height={35} src={session.user.image} alt='Foto do usuário' />
            </div>
            Olá {session.user.name}
            <FaGithub color='#737380' className={styles.closeIcon} />
        </button>
    ) : (
        <button
            type='button'
            className={styles.signInButton}
            onClick={() => signIn('github')}
        >
            <FaGithub color='#ffb800' />
            Entrar com github
        </button>
    )
}