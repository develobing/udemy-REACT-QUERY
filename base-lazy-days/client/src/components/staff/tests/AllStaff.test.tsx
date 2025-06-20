import { AllStaff } from '../AllStaff';

import { render, screen } from '@/test-utils';

test('renders response from query', async () => {
  // the magic happens here
  render(<AllStaff />);

  const staffTitles = await screen.findAllByRole('heading', {
    name: /sandra|divya|mateo|michael/i,
  });

  expect(staffTitles).toHaveLength(4);
});
