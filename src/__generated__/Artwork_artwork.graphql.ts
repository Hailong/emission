/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { ArtworkTombstone_artwork$ref } from "./ArtworkTombstone_artwork.graphql";
declare const _Artwork_artwork$ref: unique symbol;
export type Artwork_artwork$ref = typeof _Artwork_artwork$ref;
export type Artwork_artwork = {
    readonly title: string | null;
    readonly " $fragmentRefs": ArtworkTombstone_artwork$ref;
    readonly " $refType": Artwork_artwork$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "Artwork_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkTombstone_artwork",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '4edd8c17ae40e94b249c04a80eb71abc';
export default node;
