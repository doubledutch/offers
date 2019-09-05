import React from 'react'
import './App.css'
import CheckIcon from './CheckIcon'

const SettingsContainer = ({ showDisclaimer, updateShowDisclaimer }) => {
  return (
    <div className="settingsContainer">
      <h1>Settings</h1>
      <div className="settingsSubContainer">
        <p className="boxTitleBold">
          Show disclaimer that user information will be shared with the associated offer company?
        </p>
        <CheckIcon
          allowAnom={showDisclaimer}
          offApprove={() => updateShowDisclaimer(false)}
          onApprove={() => updateShowDisclaimer(true)}
        />
      </div>
    </div>
  )
}

export default SettingsContainer
