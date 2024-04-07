import "./App.css";
import { Suspense } from "react";
import { a, useSpring } from "@react-spring/web";
import { Provider, atom, useAtom, useSetAtom } from "jotai";
import { Container, Header, Image } from "semantic-ui-react";

type PostData = {
  by: string;
  text?: string;
  time: number;
  url?: string;
  title?: string;
  content: string;
  image_url: string;
  published_at: string;
  description: string;
  data: Array<any>;
};

const postId = atom(1);
const postData = atom(async (get) => {
  const id = get(postId);

  const response = await fetch(
    `https://api.thenewsapi.com/v1/news/top?api_token=${
      import.meta.env.VITE_API_KEY
    }&locale=us&limit=1&page=${id}`
  );

  console.log(response);
  const data: PostData = await response.json();
  console.log(data.data);
  return data.data[0];
});

function Id() {
  const [id] = useAtom(postId);
  const props = useSpring({ from: { id }, id, reset: true });
  return (
    <>
      <a.div>{props.id.to(Math.round)}</a.div>
    </>
  );
}

function Next() {
  const setPostId = useSetAtom(postId);
  const [id] = useAtom(postId);
  useSpring({ from: { id }, id, reset: true });
  const hantei =
    id > 1 ? (
      <button onClick={() => setPostId((id) => id - 1)}>
        <div>👈Back</div>
      </button>
    ) : (
      <></>
    );

  console.log(hantei);
  return (
    <>
      {" "}
      You are reading the feed#
      <Id />
      {hantei}
      <button onClick={() => setPostId((id) => id + 1)}>
        <div>Next headline👉</div>
      </button>
    </>
  );
}

function PostTitle() {
  const [data] = useAtom(postData);
  const imageUrlfromFeed = data.image_url;
  const convertedTimestamp = new Date(data.published_at).toUTCString();
  return (
    <>
      {" "}
      <Header as="h2" content="📰News Feed" textAlign="center" />
      <Container text style={{ marginTop: "1em" }}>
        {data.url && (
          <h2>
            <a href={data.url}>{data.title}</a>
          </h2>
        )}
        {data.image_url && <Image src={imageUrlfromFeed} width="40%" />}
        {data.description && <div>{data.description}</div>}
        {data.published_at && (
          <div>Published at: {convertedTimestamp}</div>
        )}{" "}
        {data.url && (
          <h4>
            <a href={data.url}>Click to read full story▶</a>
          </h4>
        )}
      </Container>
    </>
  );
}

export default function App() {
  return (
    <Provider>
      <div>
        <Suspense fallback={<h2>Loading...</h2>}>
          <Next />
          <PostTitle />
        </Suspense>
      </div>{" "}
      <p>2024 - Nori© All rights reserved.</p>
    </Provider>
  );
}
