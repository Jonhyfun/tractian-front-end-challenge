import { Asset, GetAsset, GetAssets } from "@/api/fakeapi"
import { GetServerSideProps } from "next"

type ServerSideReturn = {
  asset: Asset
}

export const getServerSideProps: GetServerSideProps<ServerSideReturn> = async ({ res, query }) => {
  let asset: Asset = {} as any;

  try {
    asset = await GetAsset(query.id as string);
  }
  catch {
    res.writeHead(301, { Location: '/' });
    res.end();
  }

  return {
    props: {
      asset,
    }
  }
}

export default function Assets({ asset }: ServerSideReturn) {
  return (
    <>
    </>
  )
}