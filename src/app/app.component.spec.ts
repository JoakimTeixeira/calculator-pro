import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(() => {
    component = new AppComponent();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call the openDialog function when the button is clicked', () => {
    const spy = jest.spyOn(component, 'openDialog');
    component.openDialog();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
