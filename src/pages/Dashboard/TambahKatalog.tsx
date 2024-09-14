import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { Dropzone, FileMosaic } from '@files-ui/react';
// import 'dotenv/config'

const FormLayout = () => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const [files, setFiles] = useState([]);
  const updateFiles = (incomingFiles) => {
    setFiles(incomingFiles);
  };
  const removeFile = (id) => {
    setFiles(files.filter((x) => x.id !== id));
  };

  const [submitLoading, setLoading] = useState<any>(false);
  const [formData, setFormData] = useState<any>({
    nama: '',
    deskripsi: '',
    kategori: '',
    stok: '',
    harga: '',
    diskon: '',
    persenDiskon: '',
    warna: '',
    berat: '',
    lazada: '',
    shopee: '',
    tokopedia: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(name,value)
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    const data = new FormData();
    data.append('nama', formData.nama);
    data.append('deskripsi', formData.deskripsi);
    data.append('kategori', formData.kategori);
    data.append('stok', formData.stok);
    data.append('harga', formData.harga);
    data.append('diskon', formData.harga-((formData.persenDiskon/100)*formData.harga));
    data.append('warna', formData.warna);
    data.append('berat', formData.berat);
    data.append('lazada', formData.lazada);
    data.append('shopee', formData.shopee);
    data.append('tokopedia', formData.tokopedia);
    Array.from(files).forEach((file, index) => {
      data.append('img', file.file);
    });

    try {
      const token = Cookies.get('access_token');
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND}/api/posts/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
        // withCredentials: true
      });

      setLoading(false);
      Swal.fire({
        text: `Sukses menambahkan ${response.data.nama}`,
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Oke'
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        text: `Error, muat ulang`,
        icon: 'warning'
      });
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tambah Katalog" />
      <div>
        <div className="flex flex-col gap-9 w-full">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Tambah Katalog</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">Nama Barang</label>
                    <input
                      type="text"
                      placeholder="Nama Barang"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      name="nama"
                      onChange={handleInputChange}
                      value={formData.nama}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:gap-6">
                  <div className="mb-4.5 w-full md:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">Harga Asli Barang</label>
                    <input
                      type="number"
                      placeholder="Harga Barang"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={handleInputChange}
                      name="harga"
                      value={formData.harga}
                      required
                    />
                  </div>

                  <div className="mb-4.5 w-full md:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Diskon (dalam persen)
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 50"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={handleInputChange}
                      name="persenDiskon"
                      value={formData.persenDiskon}
                      max="100"
                      min={0}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4.5 w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Harga Setelah Diskon {formData.persenDiskon}%
                    </label>
                    <p className='font-bold text-2xl text-white'>Rp{Number(formData.harga-((formData.persenDiskon/100)*formData.harga)).toLocaleString('id-ID')}</p>
                  </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">Stok</label>
                  <input
                    type="number"
                    placeholder="Stok Barang"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={handleInputChange}
                    name="stok"
                    value={formData.stok}
                    required
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">Kategori</label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      name="kategori"
                      value={selectedOption}
                      onChange={(e) => {
                        setSelectedOption(e.target.value);
                        changeTextColor();
                        handleInputChange(e);
                      }}
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                        isOptionSelected ? 'text-black dark:text-white' : ''
                      }`}
                      required>
                      <option value="" disabled className="text-body dark:text-bodydark">
                        Pilih Kategori Barang
                      </option>
                      <option value="1" className="text-body dark:text-bodydark">
                        Bak
                      </option>
                      <option value="2" className="text-body dark:text-bodydark">
                        Box
                      </option>
                      <option value="3" className="text-body dark:text-bodydark">
                        Sparepart
                      </option>
                      <option value="4" className="text-body dark:text-bodydark">
                        Bekas
                      </option>
                    </select>
                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">Deskripsi</label>
                  <textarea
                    rows={9}
                    placeholder="Deskripsi Barang"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={handleInputChange}
                    name="deskripsi"
                    value={formData.deskripsi}
                    required></textarea>
                </div>

                <div className="flex flex-col lg:flex-row lg:gap-6">
                  <div className="mb-4.5 md:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">Warna Barang</label>
                    <input
                      placeholder="Warna"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={handleInputChange}
                      name="warna"
                      value={formData.warna}
                      required
                    />
                  </div>

                  <div className="mb-4.5 md:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">Berat Barang</label>
                    <input
                      placeholder="Berat"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={handleInputChange}
                      name="berat"
                      value={formData.berat}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row lg:gap-6">
                  <div className="mb-4.5 md:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">Link Lazada</label>
                    <input
                      placeholder="https://www.lazada.co.id/...."
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={handleInputChange}
                      name="lazada"
                      value={formData.lazada}
                      required
                    />
                  </div>

                  <div className="mb-4.5 md:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">Link Shopee</label>
                    <input
                      placeholder="https://shopee.co.id/..."
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={handleInputChange}
                      name="shopee"
                      value={formData.shopee}
                      required
                    />
                  </div>
                  <div className="mb-4.5 md:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">Link Tokopedia</label>
                    <input
                      placeholder="https://www.tokopedia.com/...."
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={handleInputChange}
                      name="tokopedia"
                      value={formData.tokopedia}
                      required
                    />
                  </div>

                </div>
                <div className="mb-6">
                  <label className="mb-2.5 block text-black dark:text-white">Gambar</label>
                  <div>
                    <Dropzone onChange={updateFiles} value={files} maxFiles={10} accept={'image/*'}>
                      {files.map((file) => (
                        <FileMosaic key={file.id} {...file} onDelete={removeFile} info preview />
                      ))}
                    </Dropzone>
                  </div>
                </div>

                <button
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  type="submit"
                  disabled={submitLoading}>
                  {submitLoading ? 'Sedang Upload...' : 'Tambah Katalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FormLayout;
