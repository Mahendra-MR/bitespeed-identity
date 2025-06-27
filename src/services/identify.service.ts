import prisma from '../utils/db';

export const identifyUser = async (
  email?: string,
  phoneNumber?: string
) => {
  const contacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined },
      ],
    },
  });

  let primaryContact;
  let allContacts = contacts;

  if (contacts.length > 0) {
    // Determine the primary contact (earliest one)
    primaryContact = contacts.reduce((prev, current) =>
      prev.createdAt < current.createdAt ? prev : current
    );

    // Link any unlinked contacts
    for (const contact of contacts) {
      if (
        contact.id !== primaryContact.id &&
        (contact.linkPrecedence === 'primary' || contact.linkedId !== primaryContact.id)
      ) {
        await prisma.contact.update({
          where: { id: contact.id },
          data: {
            linkedId: primaryContact.id,
            linkPrecedence: 'secondary',
          },
        });
      }
    }

    // If this input is new, insert it as secondary
    const matchExists = contacts.some(
      (c) => c.email === email && c.phoneNumber === phoneNumber
    );
    if (!matchExists) {
      const newContact = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkedId: primaryContact.id,
          linkPrecedence: 'secondary',
        },
      });
      allContacts.push(newContact);
    }
  } else {
    // New contact (no match)
    primaryContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: 'primary',
      },
    });
    allContacts = [primaryContact];
  }

  // Fetch updated records
  const linkedContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primaryContact.id },
        { linkedId: primaryContact.id },
      ],
    },
  });

  const emails = [
    ...new Set(linkedContacts.map((c) => c.email).filter(Boolean)),
  ];
  const phoneNumbers = [
    ...new Set(linkedContacts.map((c) => c.phoneNumber).filter(Boolean)),
  ];
  const secondaryIds = linkedContacts
    .filter((c) => c.linkPrecedence === 'secondary')
    .map((c) => c.id);

  return {
    primaryContactId: primaryContact.id,
    emails,
    phoneNumbers,
    secondaryContactIds: secondaryIds,
  };
};
