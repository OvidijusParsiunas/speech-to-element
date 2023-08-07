import './AzureOptions.css';

function CredentialsInput(props: {
  activeAzureOption: string;
  azureCredentials: string;
  setAzureCredentials: (state: string) => void;
}) {
  return (
    <input
      id="credentials"
      placeholder={props.activeAzureOption === 'subscription' ? 'Subscription key' : 'Token'}
      value={props.azureCredentials}
      onChange={(event) => props.setAzureCredentials(event.target.value)}
    />
  );
}

function OptionsDropdown(props: {activeAzureOption: string; setActiveAzureOption: (state: string) => void}) {
  return (
    <select
      className={'dropdown'}
      value={props.activeAzureOption}
      onChange={(event) => {
        props.setActiveAzureOption(event.target.value);
      }}
    >
      <option value="subscription">Subscription key</option>
      <option value="token">Token</option>
      <option value="retrieve">Retrieve token</option>
    </select>
  );
}

function RegionDropdown(props: {activeAzureRegion: string; setActiveAzureRegion: (state: string) => void}) {
  return (
    <select
      id="region"
      className={'dropdown'}
      value={props.activeAzureRegion}
      onChange={(event) => {
        props.setActiveAzureRegion(event.target.value);
      }}
    >
      <option value="" disabled>
        Select region
      </option>
      <option value="westus">West US</option>
      <option value="westus2">West US 2</option>
      <option value="eastus">East US</option>
      <option value="eastus2">East US 2</option>
      <option value="eastasia">East Asia</option>
      <option value="southeastasia">South East Asia</option>
      <option value="centralindia">Central India</option>
      <option value="northeurope">North Europe</option>
      <option value="westeurope">West Europe</option>
    </select>
  );
}

export default function AzureOptions(
  activeAzureOption: string,
  setActiveAzureOption: (state: string) => void,
  activeAzureRegion: string,
  setActiveAzureRegion: (state: string) => void,
  azureCredentials: string,
  setAzureCredentials: (state: string) => void
) {
  return (
    <div id="azure-options">
      <OptionsDropdown activeAzureOption={activeAzureOption} setActiveAzureOption={setActiveAzureOption}></OptionsDropdown>
      <RegionDropdown activeAzureRegion={activeAzureRegion} setActiveAzureRegion={setActiveAzureRegion}></RegionDropdown>
      {(activeAzureOption === 'subscription' || activeAzureOption === 'token') && (
        <CredentialsInput
          activeAzureOption={activeAzureOption}
          azureCredentials={azureCredentials}
          setAzureCredentials={setAzureCredentials}
        ></CredentialsInput>
      )}
      {activeAzureOption === 'retrieve' && (
        <div id="subscription-key-tip">
          The browser will make a GET request to http://localhost:8080/token, please see{' '}
          <a
            href="https://github.com/OvidijusParsiunas/speech-to-element/tree/main/examples"
            target="_blank"
            rel="noreferrer"
          >
            server examples
          </a>
          .
        </div>
      )}
    </div>
  );
}
