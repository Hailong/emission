import { Theme } from "@artsy/palette"
import { CityBMWList_city } from "__generated__/CityBMWList_city.graphql"
import { CityBMWListQueryVariables } from "__generated__/CityBMWListQuery.graphql"
import { PAGE_SIZE } from "lib/data/constants"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import { Schema, screenTrack } from "lib/utils/track"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp, RelayProp } from "react-relay"
import { EventList } from "./Components/EventList"

interface Props extends Pick<CityBMWListQueryVariables, "citySlug"> {
  city: CityBMWList_city
  relay: RelayPaginationProp
}

interface State {
  fetchingNextPage: boolean
}

@screenTrack((props: Props) => ({
  context_screen: Schema.PageNames.CityGuideBMWList,
  context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
  context_screen_owner_slug: props.city.slug,
  context_screen_owner_id: props.city.slug,
}))
class CityBMWList extends React.Component<Props, State> {
  state = {
    fetchingNextPage: false,
  }

  fetchData = () => {
    const { relay } = this.props

    if (!relay.hasMore() || relay.isLoading()) {
      return
    }
    this.setState({ fetchingNextPage: true })
    relay.loadMore(PAGE_SIZE, error => {
      if (error) {
        console.error("CitySectionList.tsx #fetchData", error.message)
        // FIXME: Handle error
      }
      this.setState({ fetchingNextPage: false })
    })
  }

  // @TODO: Implement test for this component https://artsyproduct.atlassian.net/browse/LD-562
  render() {
    const {
      city: {
        name,
        sponsoredContent: { shows },
      },
      relay,
    } = this.props
    const { fetchingNextPage } = this.state
    return (
      <Theme>
        <EventList
          key={name + "bmw"}
          cityName={name}
          bucket={shows.edges.map(e => e.node) as any}
          header="BMW Art Guide"
          type="BMW Art Guide"
          relay={relay as RelayProp}
          onScroll={isCloseToBottom(this.fetchData)}
          fetchingNextPage={fetchingNextPage}
        />
      </Theme>
    )
  }
}

export default createPaginationContainer(
  CityBMWList,
  {
    city: graphql`
      fragment CityBMWList_city on City
        @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String", defaultValue: "" }) {
        name
        slug
        sponsoredContent {
          shows(first: $count, status: RUNNING, after: $cursor, sort: PARTNER_ASC)
            @connection(key: "CityBMWList_shows") {
            edges {
              node {
                slug
                internalID
                id
                name
                status
                href
                is_followed: isFollowed
                isStubShow
                exhibition_period: exhibitionPeriod
                cover_image: coverImage {
                  url
                }
                location {
                  coordinates {
                    lat
                    lng
                  }
                }
                type
                start_at: startAt
                end_at: endAt
                partner {
                  ... on Partner {
                    name
                    type
                    profile {
                      image {
                        url(version: "square")
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.city && props.city.sponsoredContent && props.city.sponsoredContent.shows
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        citySlug: props.citySlug,
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query CityBMWListQuery($count: Int!, $cursor: String, $citySlug: String!) {
        city(slug: $citySlug) {
          ...CityBMWList_city @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
