import { ArrowRightIcon, Box, Button, CloseIcon, color, Flex, Sans, Serif, space } from "@artsy/palette"
import { SortOptionsScreen as SortOptions } from "lib/Components/ArtworkFilterOptions/SortOptions"
import React from "react"
import {
  FlatList,
  LayoutAnimation,
  Modal as RNModal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ViewProperties,
} from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import styled from "styled-components/native"

interface FilterModalProps extends ViewProperties {
  closeModal?: () => void
  navigator?: NavigatorIOS
  isFilterArtworksModalVisible: boolean
}

interface FilterModalState {
  isComponentMounted: boolean
  sortableItems: Array<{ type: string; data: any }>
}

export class FilterModalNavigator extends React.Component<FilterModalProps, FilterModalState> {
  state: FilterModalState = {
    isComponentMounted: false,
    sortableItems: [],
  }

  componentDidMount() {
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      this.setState({ isComponentMounted: true })
    }, 100)
  }

  closeModal() {
    if (this.props.closeModal) {
      this.props.closeModal()
    }
  }

  render() {
    const { isFilterArtworksModalVisible } = this.props
    const { isComponentMounted } = this.state

    return (
      <>
        {isFilterArtworksModalVisible && (
          <RNModal animationType="fade" transparent={true} visible={isFilterArtworksModalVisible}>
            <TouchableWithoutFeedback onPress={null}>
              <ModalBackgroundView>
                <TouchableOpacity onPress={this.props.closeModal} style={{ flexGrow: 1 }} />
                <ModalInnerView visible={isComponentMounted}>
                  <NavigatorIOS
                    navigationBarHidden={true}
                    initialRoute={{
                      component: FilterOptions,
                      passProps: { closeModal: this.props.closeModal },
                      title: "", // this property (can be an empty string) is required otherwise RN throws a warning
                    }}
                    style={{ flex: 1 }}
                  />
                  <Box p={2}>
                    <Button onPress={() => this.closeModal()} block width={100} variant="secondaryOutline">
                      Apply
                    </Button>
                  </Box>
                </ModalInnerView>
              </ModalBackgroundView>
            </TouchableWithoutFeedback>
          </RNModal>
        )}
      </>
    )
  }
}

interface FilterOptionsState {
  filterOptions: Array<{ type: string; onTap: () => void }>
}

interface FilterOptionsProps {
  closeModal: () => void
  navigator: NavigatorIOS
}
export class FilterOptions extends React.Component<FilterOptionsProps, FilterOptionsState> {
  state: FilterOptionsState = {
    filterOptions: [],
  }

  componentDidMount() {
    const filterOptions = []

    filterOptions.push({
      type: "Sort by",
      onTap: this.handleNavigationToSortScreen,
    })

    this.setState({
      filterOptions,
    })
  }

  handleNavigationToSortScreen = () => {
    this.props.navigator.push({
      component: SortOptions,
    })
  }

  render() {
    const { filterOptions } = this.state

    return (
      <Flex flexGrow={1}>
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex alignItems="flex-end" mt={0.5} mb={2}>
            <CloseIconContainer onPress={() => this.props.closeModal()}>
              <CloseIcon fill="black100" />
            </CloseIconContainer>
          </Flex>
          <FilterHeader weight="medium" size="4">
            Filter
          </FilterHeader>
          <Sans mr={2} mt={2} size="4">
            Clear all
          </Sans>
        </Flex>
        <Flex>
          <FlatList<{ onTap: () => void; type: string }>
            keyExtractor={(_item, index) => String(index)}
            data={filterOptions}
            renderItem={({ item }) => (
              <Box>
                {
                  <OptionListItem>
                    <Flex p={2} flexDirection="row" justifyContent="space-between" flexGrow={1}>
                      <Serif size="3">{item.type}</Serif>
                      <TouchableOptionListItemRow onPress={() => item.onTap()}>
                        <Serif color={color("black60")} size="3">
                          Default
                        </Serif>
                        <ArrowRightIcon fill="black30" ml={0.3} mt={0.3} />
                      </TouchableOptionListItemRow>
                    </Flex>
                  </OptionListItem>
                }
              </Box>
            )}
          />
        </Flex>
        <BackgroundFill />
      </Flex>
    )
  }
}

export const FilterHeader = styled(Sans)`
  margin-top: 20px;
`

export const BackgroundFill = styled(Flex)`
  background-color: ${color("black10")};
  flex-grow: 1;
`

export const FilterArtworkButtonContainer = styled(Flex)`
  position: absolute;
  bottom: 50;
  flex: 1;
  justify-content: center;
  width: 100%;
  flex-direction: row;
`

export const FilterArtworkButton = styled(Button)`
  border-radius: 100;
  width: 110px;
`

export const TouchableOptionListItemRow = styled(TouchableOpacity)`
  flex-direction: row;
`
export const CloseIconContainer = styled(TouchableOpacity)`
  margin-left: ${space(2)};
  margin-top: ${space(2)};
`

export const OptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  border: solid 0.5px ${color("black10")};
  border-right-width: 0;
  border-left-width: 0;
  flex: 1;
  width: 100%;
`

const ModalBackgroundView = styled.View`
  background-color: #00000099;
  flex: 1;
  flex-direction: column;
  border-top-left-radius: ${space(1)};
  border-top-right-radius: ${space(1)};
`

const ModalInnerView = styled.View<{ visible: boolean }>`
  flex-direction: column;
  background-color: ${color("white100")};
  height: 75%;
  border-top-left-radius: ${space(1)};
  border-top-right-radius: ${space(1)};
`
