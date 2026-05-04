"use client";

import ComponentContainer from "./ComponentContainer";
import ExampleContainer from "./ExampleContainer";
import { MultiAsyncSelect } from "./MultiAsyncSelect";

interface Props {
  options: {
    label: string;
    value: string;
  }[];
}

const SyncSelectExample = ({ options }: Props) => {
  return (
    <ExampleContainer
      title="Sync Usage"
      link="https://github.com/yayapao/shadcn-multi-async-select/blob/main/src/app/_example/sync-select.tsx"
      desc={
        <>
          This example demonstrates how to use <b className="text-primary">the fetched options</b> to select multiple cities from a list of
          options.
        </>
      }
    >
      <ComponentContainer>
        <MultiAsyncSelect
          options={options}
          onValueChange={(value: any) => console.log(value)}
          maxCount={3}
          className="w-[480px]"
          placeholder="Select cities"
        />
      </ComponentContainer>
    </ExampleContainer>
  );
};

export default SyncSelectExample;
