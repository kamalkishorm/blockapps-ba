import {
  takeLatest,
  put,
  call
} from 'redux-saga/effects';
import {
  API_URL,
  API_MOCK
} from '../../../../../environment';
import {
  handleApiError
} from '../../../../../lib/apiErrorHandler';
import {
  FETCH_PROJECT,
  fetchProjectSuccess,
  fetchProjectFailure
} from '../actions/project.actions';

// TODO: define API endpoint for projects
const url = API_URL + '/projects/{0}';

function getProjectMock(projectId) {
  return new Promise(function(resolve, reject) {
    resolve({
      data: {
        project: {
          id: projectId,
          created: '2017-05-09T16:47:49.016Z',
          buyer: 'buyer1',
          name: 'T-Shirts with logo',
          description: 'The T-Shirts with our company\'s logo on the chest, Qty: 50',
          priceDesired: 800.10,
          desiredDeliveryDate: '2017-05-20T16:47:49.016Z',
          deliveryAddress: {
            street: '109 S 5th street',
            city: 'Brooklyn',
            state: 'New York',
            zip: '11249'
          },
          spec: 'Ius te dicit probatus intellegebat, no minimum molestiae delicatissimi cum. Omnium officiis instructior ne mel,',
          status: 'open',
          deliveredDate: '2017-05-20T16:47:49.016Z'
        }
      }
    });
  });
}

function getProject(projectId) {
  if (API_MOCK) {
    return getProjectMock(projectId);
  }
  return fetch(url.replace('{0}', projectId), {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(handleApiError)
    .then(function(response) {
      return response.json();
    })
    .catch(function(error) {
      throw error;
    });
}

function* fetchProject(action) {
  try {
    const response = yield call(getProject,action.projectId);
    yield put(fetchProjectSuccess(response.data['project']));
  } catch (err) {
    yield put(fetchProjectFailure(err.message));
  }
}

export default function* watchFetchProject() {
  yield takeLatest(FETCH_PROJECT, fetchProject);
}