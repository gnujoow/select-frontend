import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { forceCheck } from 'react-lazyload';
import * as differenceInHours from 'date-fns/difference_in_hours'

import { FetchStatusFlag } from 'app/constants';
import { BookState } from 'app/services/book';
import { ActionLoadHomeRequest, loadHomeRequest } from 'app/services/home/actions';
import { ConnectedBigBannerCarousel } from 'app/services/home/components/BigBanner';
import { SelectionsState } from 'app/services/selection';
import { RidiSelectState } from 'app/store';
import { ConnectedHomeSectionList } from 'app/services/home/components/HomeSectionList';
import { ActionLoadSelectionRequest, loadSelectionRequest, SelectionId } from 'app/services/selection/actions';

interface HomeDispatchProps {
  dispatchLoadHomeRequest: () => ActionLoadHomeRequest;
  dispatchLoadSelectionRequest: (selectionid: SelectionId) => ActionLoadSelectionRequest;
}

interface HomeStateProps {
  fetchStatus: FetchStatusFlag;
  fetchedAt: number | null;
  selectionIdList: number[];
  books: BookState;
  selections: SelectionsState;
}
interface State {
  isInitialized: boolean;
}

export class Home extends React.PureComponent<HomeDispatchProps & HomeStateProps, State> {
  private initialDispatchTimeout?: number | null;
  public state: State = {
    isInitialized: false,
  };

  public componentDidMount() {
    this.initialDispatchTimeout = window.setTimeout(() => {
      const {
        fetchedAt,
        dispatchLoadHomeRequest,
        dispatchLoadSelectionRequest
      } = this.props;
      if (
        !fetchedAt ||
        Math.abs(differenceInHours(fetchedAt, Date.now())) >= 3
      ) {
        dispatchLoadHomeRequest();
        dispatchLoadSelectionRequest('hotRelease');
      }
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
      forceCheck();
    });
  }

  public componentWillUnmount() {
    if (this.initialDispatchTimeout) {
      window.clearTimeout(this.initialDispatchTimeout);
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    }
  }

  public render() {
    return (
      <main className='SceneWrapper PageHome'>
        <Helmet>
          <title>리디셀렉트</title>
        </Helmet>
        <div className="a11y"><h1>리디셀렉트 홈</h1></div>
        <ConnectedBigBannerCarousel />
        <ConnectedHomeSectionList />
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): HomeStateProps => {
  return {
    fetchStatus: state.home.fetchStatus,
    fetchedAt: state.home.fetchedAt,
    selectionIdList: state.home.selectionIdList,
    selections: state.selectionsById,
    books: state.booksById,
  };
};

const mapDispatchToProps = (dispatch: any): HomeDispatchProps => {
  return {
    dispatchLoadHomeRequest: () => dispatch(loadHomeRequest()),
    dispatchLoadSelectionRequest: (selectionid: SelectionId) => dispatch(loadSelectionRequest(selectionid, 1)),
  };
};

export const ConnectedHome = connect(mapStateToProps, mapDispatchToProps)(Home);
