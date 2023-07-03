import { useLoaderData } from "@remix-run/react";
import { checkEnvVars, checkStatus } from "../utils/errorHandling";
import url from "../utils/url";
import { Layout } from "../components";
import styles from "../components/style.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

export async function loader({ params }: { params: any }) {
  const { postId } = params; // get the post id
  checkEnvVars(); // check the environmental variables

  const response = await fetch(
    `${process.env.STRAPI_URL_BASE}/api/blogs/${postId}?populate=hero`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  ); // send a request to strapi backend to get the post
  checkStatus(response); // check the response status

  const data = await response.json(); // get the json data
  if (data.error) {
    // check if we have an error
    throw new Response("Error loading data from strapi", { status: 500 });
  }

  return data.data; // return the data
}

export default function Post() {
  const blog = useLoaderData();
  const blogData = blog.attributes;
  return (
    <Layout>
      <div className="blog-post">
        <div className="blog-post-hero">
          <img
            src={`${url}${blogData.hero.data.attributes.url}`}
            alt={`${blogData.hero.data.attributes.alternativeText}`}
          />
        </div>
        <div className="blog-post-title">
          <h1>{blogData.title}</h1>
        </div>
        <div className="blog-post-content">
          <div dangerouslySetInnerHTML={{ __html: blogData.content }} />
        </div>
      </div>
    </Layout>
  );
}
