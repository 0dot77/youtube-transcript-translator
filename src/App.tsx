import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import "./app.css";

const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: import.meta.env.VITE_ASSEMBLY_KEY,
  },
});

type transcriptType = {
  text: string;
};

export default function App() {
  const [url, setUrl] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [transcript, setTranscript] = useState<transcriptType | null>(null);
  const [result, setResult] = useState<string | undefined>("");

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const {
      target: { value },
    } = e;
    setUrl(value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function submitAudioUrlToAssembly(url: string) {
    assembly
      .post("/transcript", {
        audio_url: url,
      })
      .then((res) => {
        setId(res.data.id);
      })
      .catch((err) => console.error(err));
  }

  async function getAudioToTextData(id: string): Promise<void> {
    try {
      await assembly.get(`/transcript/${id}`).then((res) => {
        setTranscript(res.data);
        setResult(transcript?.text);
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <h1>Youtube Translator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="url input"
          onChange={handleOnChange}
        />
        <button
          type="submit"
          onClick={() => submitAudioUrlToAssembly(url)}
        >
          Submit
        </button>
        <button
          type="submit"
          onClick={() => getAudioToTextData(id)}
        >
          Check Status
        </button>
      </form>
      {result && (
        <p
          style={{
            color: "#ffffff",
          }}
        >
          {result}
        </p>
      )}
    </>
  );
}
