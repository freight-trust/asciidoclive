import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as React from 'react';
import environment from '../environment/environment';
import storageManager from '../storage/storage-manager';
import StorageType from '../storage/storage-type';

export type Stage =
  | 'auth-prompt'
  | 'auth-pending'
  | 'action-prompt'
  | 'action-pending'
  | 'action-error';

const DEFAULT_STAGE: Stage = 'auth-prompt';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  storageType: StorageType | null;
  initialStage: Stage | null;
  action: (() => Promise<void>) | null;
  actionLabel: string | null;
  actionTitle: string | null;
  actionResultPromise: Promise<any> | null;
}

interface State {
  stage: Stage;
  actionErrorMessage: string | null;
}

class StorageActionView extends React.Component<Props, State> {
  state: State = {
    stage: DEFAULT_STAGE,
    actionErrorMessage: null,
  };

  render() {
    if (!this.storageProvider) {
      return null;
    }
    let {displayName} = this.storageProvider;
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={this.onClose.bind(this)}
        fullWidth={true}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
      >
        {this.state.stage === 'auth-prompt' && (
          <>
            <DialogTitle>Log in to {displayName}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To continue, you will need to log in to your {displayName}{' '}
                account.
              </DialogContentText>
              <DialogContentText>
                Your account and document data will only be processed on this
                computer, and no data will be shared with{' '}
                {environment.siteDisplayName}.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onClose.bind(this)} color="primary">
                Cancel
              </Button>
              <Button onClick={this.onAuthClick.bind(this)} color="primary">
                Log in to {displayName}
              </Button>
            </DialogActions>
          </>
        )}
        {this.state.stage === 'auth-pending' && (
          <>
            <DialogTitle>Log in to {displayName}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Waiting for {displayName}...
              </DialogContentText>
            </DialogContent>
          </>
        )}
        {this.state.stage === 'action-prompt' && (
          <>
            <DialogTitle>Logged in to {displayName}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                You have successfully logged in to your {displayName} account.
              </DialogContentText>
              <DialogContentText>
                Press CONTINUE to {this.props.actionLabel}.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onActionClick.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </>
        )}
        {this.state.stage === 'action-pending' && (
          <>
            <DialogTitle>{this.props.actionTitle}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Waiting for {displayName}...
              </DialogContentText>
            </DialogContent>
          </>
        )}
        {this.state.stage === 'action-error' && (
          <>
            <DialogTitle>{this.props.actionTitle}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                An error occurred while communicating with {displayName}. Please
                try again or report the error.
              </DialogContentText>
              {this.state.actionErrorMessage && (
                <DialogContentText>
                  Error message: {this.state.actionErrorMessage}
                </DialogContentText>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onClose.bind(this)} color="primary">
                OK
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    );
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    let didOpen = this.props.isOpen && !prevProps.isOpen;
    if (didOpen) {
      this.setState({stage: this.props.initialStage || 'auth-prompt'});
    }
    if (
      this.state.stage === 'action-pending' &&
      (didOpen || prevState.stage !== 'action-pending') &&
      this.props.actionResultPromise
    ) {
      this.watchActionResult();
    }
  }

  private onClose() {
    this.props.onClose();
  }

  private async onAuthClick() {
    this.setState({stage: 'auth-pending'});
    let authResult = await this.storageProvider!.auth();
    if (authResult) {
      this.setState({stage: 'action-prompt'});
    } else {
      this.onClose();
    }
  }

  private async onActionClick() {
    this.setState({stage: 'action-pending'});
    this.props.action && (await this.props.action());
    this.onClose();
  }

  private async watchActionResult() {
    try {
      await this.props.actionResultPromise;
      this.onClose();
    } catch (e) {
      let message = (e && e.message) || null;
      this.setState({stage: 'action-error', actionErrorMessage: message});
    }
  }

  private get storageProvider() {
    if (this.props.storageType === null) {
      return null;
    }
    return storageManager.getStorageProvider(this.props.storageType);
  }
}

export default StorageActionView;
