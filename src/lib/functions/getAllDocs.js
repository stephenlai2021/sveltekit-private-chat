import { db } from '$lib/firebase/client'
import { collection, getDocs, query, where } from 'firebase/firestore'

export const getAllDocs = async (c, q) => {
  let docs = []
  let error = null
  let tempDocs = []
  
  try {
    let colRef = collection(db, c)    
    if (q) colRef = query(colRef, where(...q))

    const querySnapshot = await getDocs(colRef);

    // if (querySnapshot) throw new Error('The use does not exist !')

    querySnapshot.forEach((doc) => {
      tempDocs.push(doc.data());
    });
    docs = tempDocs;
    // console.log('docs | functions ', docs)
  } catch (err) {
    error = err.message
  }

  return { docs, error }  
}
