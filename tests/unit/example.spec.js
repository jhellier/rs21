import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    })
    expect(wrapper.text()).to.include(msg);
    //expect(wrapper.find('.error').exists()).to.be(true);

  }),

  it('Finds that 42 = 42', () => {
    var answer = 42;
    expect (answer).to.equals(42);
    //expect(wrapper.find('.error').exists()).to.be(true);

  })

})
