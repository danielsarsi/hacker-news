import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { Item, obterItem, obterTopStories } from "../lib/api";
import styleInicio from "../styles/Inicio.module.css";
import styleItem from "../styles/Item.module.css";

export const MAXIMO_ITENS = 30;

interface InicioProps {
  itens: Item[];
}

export const getStaticProps: GetStaticProps<InicioProps> = async () => {
  const topStories = await obterTopStories();

  const itensDaPagina = topStories.slice(0, MAXIMO_ITENS);

  const itens: Item[] = [];
  for (const id of itensDaPagina) {
    itens.push(await obterItem(id));
  }

  return {
    props: {
      itens,
    },
    revalidate: 60,
  };
};

function Inicio({ itens }: InferGetStaticPropsType<typeof getStaticProps>) {
  const itensLista = itens.map((item) => {
    let comentarios = `${item.descendants ?? 0} comentários`;
    if (item.descendants === 1) {
      comentarios = "1 comentário";
    }

    return (
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
            <a href={`item/${item.id}`}>{comentarios}</a>
          </footer>
        </article>
      </li>
    );
  });

  return (
    <main>
      <Head>
        <title>hacker news</title>
      </Head>
      <ol className={styleInicio.lista}>{itensLista}</ol>
    </main>
  );
}

export default Inicio;
