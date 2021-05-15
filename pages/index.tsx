import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Layout from "../components/layout";
import { Item, obter, obterItem, obterTopStories } from "../lib/api";
import styleInicio from "../styles/Inicio.module.css";
import styleItem from "../styles/Item.module.css";

export const MAXIMO_ITENS = 30;

interface InicioProps {
  itens: Item[];
}

export const getStaticProps: GetStaticProps<InicioProps> = async () => {
  const topStories = await obterTopStories();

  // limita o número de itens
  const itensDaPagina = topStories.slice(0, MAXIMO_ITENS);
  const itens = await Promise.all(itensDaPagina.map(obterItem));

  return {
    props: {
      itens,
    },
    revalidate: 60,
  };
};

function Inicio({ itens }: InferGetStaticPropsType<typeof getStaticProps>) {
  const elementosLista: JSX.Element[] = [];
  for (const item of itens) {
    elementosLista.push(
      <li key={item.id}>
        <article className={styleItem.item}>
          <p className={styleItem.pontos}>{item.score}</p>
          <h1 className={styleItem.titulo}>
            <a
              href={item.url ?? `item/${item.id}`}
              className={styleItem[item.type]}
            >
              {item.title}
            </a>
          </h1>
          <footer className={styleItem.informacoes}>
            <span>{item.by}</span>
            <a href={`item/${item.id}`}>
              {item.descendants === 1
                ? `1 comentário`
                : `${item.descendants ?? 0} comentários`}
            </a>
          </footer>
        </article>
      </li>
    );
  }

  return (
    <Layout>
      <main>
        <ol className={styleInicio.lista}>{elementosLista}</ol>
      </main>
    </Layout>
  );
}

export default Inicio;
