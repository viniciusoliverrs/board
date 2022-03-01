import Head from 'next/head'
import styles from './styles.module.scss'
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock, FiX } from 'react-icons/fi'
import { SupportButton } from '../../components/SupportButton'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import { FormEvent, useState } from 'react'
import firebase from '../../services/firebaseConnection'
import { format } from 'date-fns'
import Link from 'next/link'

type TaskList = {
  id: string,
  created: string | Date,
  createdFormated?: string,
  task: string,
  userId: string,
  name: string
}
interface BoardProps {
  user: {
    id: string,
    name: string
  }
  data: string
}

export default function Board({ user, data }: BoardProps) {
  const [taskEdit, setTaskEdit] = useState<TaskList | null>(null)
  const [input, setInput] = useState("")
  const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));
  async function handleDelete(id: string) {
    await firebase.firestore().collection('tasks').doc(id)
      .delete()
      .then(() => {
        let taskDeleted = taskList.filter(t => {
          return (t.id !== id)
        })
        setTaskList(taskDeleted)
      }).catch((err) => {
        console.log(err)
      })
  }

  async function handleAddTask(e: FormEvent) {
    e.preventDefault()
    if (input === '') {
      alert('Preencha alguma tarefa!')
      return
    }

    if (taskEdit) {

      await firebase.firestore().collection('tasks')
        .doc(taskEdit.id)
        .update({
          tarefa: input
        })
        .then(() => {
          let data = taskList;
          let taskIndex = taskList.findIndex(item => item.id === taskEdit.id);
          data[taskIndex].task = input

          setTaskList(data);
          setTaskEdit(null);
          setInput('');

        })

      return;
    }


    let created = new Date();
    let createdFormated = format(new Date(), 'dd MM yyyy')
    await firebase.firestore()
      .collection('tasks')
      .add({
        created: created,
        task: input,
        userId: user.id,
        createdFormated: createdFormated,
        name: user.name
      }).then((doc) => {
        console.log('CADASTRADO COM SUCESSO!');
        let data = {
          id: doc.id,
          created: created,
          createdFormated: createdFormated,
          task: input,
          userId: user.id,
          name: user.name
        }
        setTaskList([
          ...taskList,
          data
        ])
        setInput('')
      }).catch((err) => console.log('ERRO AO CADASTRAR: ', err))
  }

  function handleEditTask(task: TaskList) {
    setTaskEdit(task);
    setInput(task.task);
  }

  function handleCancelEdit() {
    setInput('');
    setTaskEdit(null);
  }
  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>
      <main className={styles.container}>
        {taskEdit && (
          <span className={styles.warnText}>
            <button onClick={handleCancelEdit}>
              <FiX size={30} color="#FF3636" />
            </button>
            Você está editando uma tarefa!
          </span>
        )}
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Digite sua tarefa..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">
            <FiPlus size={25} color="#17181f" />
          </button>
        </form>

        <h1>Você tem {taskList.length} {taskList.length > 1 ? 'Tarefas' : 'Tarefa'}!</h1>
        <section>
          {taskList.map((t) => (
            <article className={styles.taskList} key={t.id}>
              <Link href={`/board/${t.id}`}>
                <p>{t.task}</p>
              </Link>
              <div className={styles.actions}>
                <div>
                  <div>
                    <FiCalendar size={20} color="#FFB800" />
                    <time>{t.createdFormated}</time>
                  </div>
                  <button onClick={() => handleEditTask(t)}>
                    <FiEdit2 size={20} color="#FFF" />
                    <span>Editar</span>
                  </button>
                </div>
                <button onClick={() => handleDelete(t.id)}>
                  <FiTrash size={20} color="#FF3636" />
                  <span>Excluir</span>
                </button>
              </div>
            </article>

          ))}
        </section>
      </main>

      <div className={styles.vipContainer}>
        <h3>Obrigado por apoiar esse projeto.</h3>
        <div>
          <FiClock size={28} color="#FFF" />
          <time>
            Última doação foi a 3 dias.
          </time>
        </div>
      </div>

      <SupportButton />

    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })
  if (!session?.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  const tasks = await firebase.firestore().collection('tasks').where('userId', '==', session?.id).orderBy('created', 'asc').get()
  const data = JSON.stringify(
    tasks.docs.map(t => {
      return {
        id: t.id,
        created: t.data().created,
        createdFormated: t.data().createdFormated,
        ...t.data()
      }
    })
  )
  const user = {
    name: session?.user.name,
    id: session?.id
  }
  return {
    props: {
      user,
      data
    }
  }
}
