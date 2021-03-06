from os import path
import re


def convert_requirements_to_conda():
    base_path = path.dirname(__file__)
    requirements_file = path.abspath(path.join(base_path, "..", "eventkit-cloud", "requirements.txt"))
    with open(requirements_file) as file:
        requirements_list = file.read().splitlines()
    conda_requirements = []
    for requirement in requirements_list:
        if "git+" in requirement:
            # Match the repository name and version from the Github URL.
            repository = "".join(requirement.split("/")[-1:]).split(".")[0]
            version = re.search("(?:@v(.*?)#)", requirement).group(1)
            conda_requirements.append(f"{repository}={version}".lower())
        else:
            conda_alias = None
            conda_match = re.search("# conda: (.*)", requirement)
            if conda_match:
                conda_alias = conda_match.group(1).strip()
            try:
                package_name, package_version = requirement.lower().split("==")
            except ValueError as ve:
                print(f"Requirement {requirement} is invalid, or is missing a pinned version.")
                raise ve
            conda_requirements.append(f"{conda_alias or package_name}=={package_version}")
    with open(path.join(base_path, "recipes", "eventkit-cloud", "conda-requirements.txt"), mode="wt", encoding="utf-8") as file:
        file.write("\n".join(conda_requirements))


if __name__ == "__main__":
    convert_requirements_to_conda()
