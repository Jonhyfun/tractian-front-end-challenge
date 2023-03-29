import { Asset, GetAssets } from "@/api/fakeapi"
import { GetServerSideProps } from "next"

type ServerSideReturn = {
  assets: Asset[]
}

export const getServerSideProps: GetServerSideProps<ServerSideReturn> = async ({ res, query }) => {
  let assets: Asset[] = [];

  try {
    assets = await GetAssets(query.id as string);
  }
  catch {
    res.writeHead(301, { Location: '/' });
    res.end();
  }

  return {
    props: {
      assets,
    }
  }
}

export default function Assets({ assets }: ServerSideReturn) {
  return (
    <>
    </>
  )
}