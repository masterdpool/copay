import { Component } from '@angular/core';
import * as _ from 'lodash';
// Providers
import { ConfigProvider } from '../../../../providers/config/config';
import { HomeIntegrationsProvider } from '../../../../providers/home-integrations/home-integrations';

@Component({
  selector: 'page-mercado-libre-settings',
  templateUrl: 'mercado-libre-settings.html'
})
export class MercadoLibreSettingsPage {
  private serviceName: string;
  public showInHome;
  public service;
  public archivedGiftCards;
  public card;
  public showArchivedCards: boolean;

  constructor(
    private configProvider: ConfigProvider,
    private homeIntegrationsProvider: HomeIntegrationsProvider
  ) {
    this.serviceName = 'mercadolibre';
    this.service = _.filter(this.homeIntegrationsProvider.get(), {
      name: this.serviceName
    });
    this.showInHome = !!this.service[0].show;
  }

  public showInHomeSwitch(): void {
    let opts = {
      showIntegration: { [this.serviceName]: this.showInHome }
    };
    this.homeIntegrationsProvider.updateConfig(
      this.serviceName,
      this.showInHome
    );
    this.configProvider.set(opts);
  }
}
