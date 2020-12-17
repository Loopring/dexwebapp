import {
  getAmmMarkets,
  getAmmSnapshot,
  getAmmSnapshots,
} from 'lightcone/api/AmmAPI';

export const UPDATE_AMM_MARKETS = 'UPDATE_AMM_MARKETS';
export const UPDATE_MY_ACTIVE_AMM_MARKETS = 'UPDATE_MY_ACTIVE_AMM_MARKETS';
export const UPDATE_AMM_SNAPSHOTS = 'UPDATE_AMM_SNAPSHOTS';

export function updateMyActiveAmmMarkets(myActiveAmmMarkets) {
  return {
    type: UPDATE_MY_ACTIVE_AMM_MARKETS,
    payload: {
      myActiveAmmMarkets,
    },
  };
}

export function updateAmmMarkets(ammMarkets) {
  return {
    type: UPDATE_AMM_MARKETS,
    payload: {
      ammMarkets,
    },
  };
}

export function fetchAmmMarkets() {
  return (dispatch) => {
    (async () => {
      try {
        let ammMarkets = await getAmmMarkets();
        let snapshots = await getAmmSnapshots();
        let updatedAmmMarkets = [];
        for (let i = 0; i < ammMarkets.length; i = i + 1) {
          let ammMarket = ammMarkets[i];
          const snapshot = snapshots.find(
            (ba) => ba.poolName === ammMarket.name
          );
          ammMarket['snapshot'] = snapshot;

          // Skip apy
          // ammMarket['apy'] = await getAPY(snapshot.poolName);
          updatedAmmMarkets.push(ammMarket);
        }
        dispatch(updateAmmMarkets(updatedAmmMarkets));
      } catch (error) {
        console.log('error', error);
      }
    })();
  };
}

export function updateAmmSnapshot(snapshot) {
  return {
    type: UPDATE_AMM_SNAPSHOTS,
    payload: {
      snapshot,
    },
  };
}

export function fetchAmmSnapshots() {
  return (dispatch) => {
    (async () => {
      try {
        let ammMarkets = await getAmmSnapshots();
        dispatch(updateAmmMarkets(ammMarkets));
      } catch (error) {}
    })();
  };
}

export function fetchAmmSnapshot(poolAddress) {
  return (dispatch) => {
    (async () => {
      try {
        const snapshot = await getAmmSnapshot(poolAddress);
        dispatch(updateAmmSnapshot(snapshot));
      } catch (error) {}
    })();
  };
}
